const express = require("express");
const Parser = require("rss-parser");
const cron = require("node-cron");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 4000;
const parser = new Parser();

app.use(cors()); // Allow all origins – adjust as needed

/* ───────────────────────────────── RSS SOURCES ────────────────────────────── */
const rssFeeds = {
  binodon: [
    "https://news.google.com/rss/search?q=%E0%A6%AC%E0%A6%BF%E0%A6%A8%E0%A7%8B%E0%A6%A6%E0%A6%A8+when:1d&hl=bn&gl=BD&ceid=BD:bn",
  ],
  kheladhula: [
    "https://news.google.com/rss/search?q=%E0%A6%96%E0%A7%87%E0%A6%B2%E0%A6%BE%E0%A6%A7%E0%A7%81%E0%A6%B2%E0%A6%BE+when:1d&hl=bn&gl=BD&ceid=BD:bn",
  ],
  topnews: [
    "https://www.prothomalo.com/feed",
    "https://www.kalerkantho.com/rss.xml",
    "https://www.banglatribune.com/feed/",
    "https://www.bd24live.com/bangla/feed/",
    "https://www.risingbd.com/rss/rss.xml",
  ],
};

/* ──────────────────────────────── IN‑MEMORY CACHE ─────────────────────────── */
let newsCache = {
  binodon: [],
  kheladhula: [],
  topnews: [],
  lastUpdated: null,
};

/* ─────────────────────────── FETCH + CACHE ALL FEEDS ──────────────────────── */
async function fetchCategoryFeeds(feeds, categoryKey = "") {
  const allFeeds = [];

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const items = feed.items.map((item) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source: feed.title || "Unknown source",
        image:
          item.enclosure?.url ||
          (item["media:content"] && item["media:content"]["$"]?.url) ||
          null,
        summary: item.contentSnippet || item.content || item.summary || "",
      }));

      allFeeds.push(items);
    } catch (err) {
      console.error(`⚠️  Failed to fetch feed: ${feedUrl}`, err.message);
    }
  }

  if (categoryKey === "topnews") {
    // Interleave feeds
    const maxLen = Math.max(...allFeeds.map((list) => list.length));
    const interleaved = [];

    for (let i = 0; i < maxLen; i++) {
      for (const feedItems of allFeeds) {
        if (feedItems[i]) interleaved.push(feedItems[i]);
      }
    }

    return interleaved;
  }

  return allFeeds.flat();
}

async function fetchAndCacheNews() {
  console.log("🔄  Fetching news from RSS feeds…");

  newsCache.binodon = await fetchCategoryFeeds(rssFeeds.binodon, "binodon");
  newsCache.kheladhula = await fetchCategoryFeeds(rssFeeds.kheladhula, "kheladhula");
  newsCache.topnews = await fetchCategoryFeeds(rssFeeds.topnews, "topnews");
  newsCache.lastUpdated = new Date();

  console.log("✅  News cached at", newsCache.lastUpdated.toLocaleString());
}

/* ───────────────────────────── CRON SCHEDULE (6 AM) ───────────────────────── */
cron.schedule("0 6 * * *", fetchAndCacheNews);

/* ───────────────────────────── INITIAL PRIMING ────────────────────────────── */
fetchAndCacheNews();

/* ─────────────────────────────── API ENDPOINTS ────────────────────────────── */
/** GET /news/all – combined list across all categories */
app.get("/news/all", (req, res) => {
  const { lastUpdated, ...categories } = newsCache;

  const combinedNews = Object.entries(categories)
    .flatMap(([category, items]) =>
      items.map((item) => ({ ...item, category }))
    );

  res.json({ lastUpdated, news: combinedNews });
});

/** GET /news/full?url=<ENCODED_URL> – scrape full article text */
app.get("/news/full", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/125 Safari/537.36",
      },
      timeout: 10_000,
    });

    const $ = cheerio.load(response.data);
    const candidateSelectors = [
      "article",
      ".content, .article-content, .entry-content, .post-content",
      "main",
      "body",
    ];

    let article = "";
    for (const sel of candidateSelectors) {
      article = $(sel).text().replace(/\s+/g, " ").trim();
      if (article.length > 50) break;
    }

    if (article.length < 50) {
      return res
        .status(404)
        .json({ error: "Could not extract article content" });
    }

    res.json({ content: article });
  } catch (err) {
    console.error("❌  Failed to fetch article:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch article", details: err.message });
  }
});

/* ─────────────────────────────── START SERVER ─────────────────────────────── */
app.listen(port, () => {
  console.log(`🚀  News back‑end running at http://localhost:${port}`);
});
