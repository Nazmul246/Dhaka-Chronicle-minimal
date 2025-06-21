const express = require("express");
const Parser = require("rss-parser");
const cron = require("node-cron");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 4000;

const parser = new Parser({
  customFields: {
    item: ["source"],
  },
});

app.use(cors());

const rssFeeds = {
  binodon: [
    "https://www.prothomalo.com/feed",
    "https://www.kalerkantho.com/rss.xml",
    "https://www.banglatribune.com/feed/",
    "https://www.bd24live.com/bangla/feed/",
    "https://www.risingbd.com/rss/rss.xml",
    "https://news.google.com/rss/search?q=%E0%A6%AC%E0%A6%BF%E0%A6%A8%E0%A7%8B%E0%A6%A6%E0%A6%A8&hl=bn&gl=BD&ceid=BD:bn",
  ],
  kheladhula: [
    "https://www.prothomalo.com/feed",
    "https://www.kalerkantho.com/rss.xml",
    "https://www.banglatribune.com/feed/",
    "https://www.bd24live.com/bangla/feed/",
    "https://www.risingbd.com/rss/rss.xml",
    "https://news.google.com/rss/search?q=%E0%A6%96%E0%A7%87%E0%A6%B2%E0%A6%BE%E0%A6%A7%E0%A7%81%E0%A6%B2%E0%A6%BE&hl=bn&gl=BD&ceid=BD:bn",
  ],
  topnews: [
    "https://www.prothomalo.com/feed",
    "https://www.kalerkantho.com/rss.xml",
    "https://www.banglatribune.com/feed/",
    "https://www.bd24live.com/bangla/feed/",
    "https://www.risingbd.com/rss/rss.xml",
    "https://news.google.com/rss?hl=bn&gl=BD&ceid=BD:bn",
  ],
};

let newsCache = {
  binodon: [],
  kheladhula: [],
  topnews: [],
  lastUpdated: null,
};

async function fetchCategoryFeeds(feeds, categoryKey = "") {
  const allFeeds = [];

  const binodonKeywords = [
    "বিনোদন", "চলচ্চিত্র", "তারকা", "সিনেমা", "নাটক", "গান",
    "অভিনেতা", "অভিনেত্রী", "অভিনয়", "শুটিং", "গায়ক", "গায়িকা",
    "মিউজিক", "ফিল্ম", "টেলিভিশন", "নায়ক", "নায়িকা", "সেলিব্রিটি",
    "বায়োপিক", "ড্রামা", "কমেডি", "ওয়েব সিরিজ", "ওটিটি", "স্টার", "আনন্দ"
  ];

  const khelaKeywords = [
    "খেলা", "ক্রিকেট", "ফুটবল", "ব্রাজিল", "আর্জেন্টিনা", "বিশ্বকাপ", "টি-টোয়েন্টি",
    "ওয়ানডে", "টেস্ট", "সাকিব", "তামিম", "মুশফিক", "বাংলাদেশ দল", "ম্যাচ", "গোল",
    "ব্যাটসম্যান", "বোলার", "ফিফা", "স্পোর্টস", "ক্রীড়া", "অলিম্পিক", "চ্যাম্পিয়নস লিগ",
    "পিএসজি", "রিয়াল মাদ্রিদ", "বার্সেলোনা", "ঢাকা লিগ", "বিপিএল"
  ];

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);

      const items = feed.items.map((item) => {
        const titleParts = item.title?.split(" - ") || [];
        const cleanTitle = titleParts[0]?.trim() || item.title;
        const sourceFromTag = item.source?.["#"]?.trim();
        const inferredSource = sourceFromTag || titleParts[1]?.trim() || feed.title || "Unknown";

        return {
          title: cleanTitle,
          link: item.link,
          pubDate: item.pubDate,
          source: inferredSource,
          image:
            item.enclosure?.url ||
            (item["media:content"] && item["media:content"]["$"]?.url) ||
            null,
          summary: item.contentSnippet || item.content || item.summary || "",
        };
      });

      let filteredItems = items;

      if (categoryKey === "binodon") {
        filteredItems = items.filter((item) =>
          binodonKeywords.some((kw) => item.title.includes(kw))
        );
      }

      if (categoryKey === "kheladhula") {
        filteredItems = items.filter((item) =>
          khelaKeywords.some((kw) => item.title.includes(kw))
        );
      }

      allFeeds.push(filteredItems);
    } catch (err) {
      console.error(`⚠️  Failed to fetch feed: ${feedUrl}`, err.message);
    }
  }

  if (categoryKey === "topnews") {
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
  console.log("🔄 Fetching news from RSS feeds…");

  newsCache.binodon = await fetchCategoryFeeds(rssFeeds.binodon, "binodon");
  newsCache.kheladhula = await fetchCategoryFeeds(rssFeeds.kheladhula, "kheladhula");
  newsCache.topnews = await fetchCategoryFeeds(rssFeeds.topnews, "topnews");
  newsCache.lastUpdated = new Date();

  console.log("✅ News cached at", newsCache.lastUpdated.toLocaleString());
}

cron.schedule("0 6 * * *", fetchAndCacheNews);

fetchAndCacheNews();

app.get("/news/bydate", (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Missing date parameter" });

  const requestedDate = new Date(date);
  if (isNaN(requestedDate)) return res.status(400).json({ error: "Invalid date format" });

  const filteredNews = [];
  for (const category of ["binodon", "kheladhula", "topnews"]) {
    const items = newsCache[category].filter((item) => {
      if (!item.pubDate) return false;
      const itemDate = new Date(item.pubDate);
      return (
        itemDate.getFullYear() === requestedDate.getFullYear() &&
        itemDate.getMonth() === requestedDate.getMonth() &&
        itemDate.getDate() === requestedDate.getDate()
      );
    });
    filteredNews.push(...items.map((item) => ({ ...item, category })));
  }

  res.json({ news: filteredNews });
});

app.get("/news/all", (req, res) => {
  const { lastUpdated, ...categories } = newsCache;
  const combinedNews = Object.entries(categories).flatMap(([category, items]) =>
    items.map((item) => ({ ...item, category }))
  );
  res.json({ lastUpdated, news: combinedNews });
});

app.get("/news/full", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/125 Safari/537.36",
      },
      timeout: 10000,
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
      return res.status(404).json({ error: "Could not extract article content" });
    }

    res.json({ content: article });
  } catch (err) {
    console.error("❌ Failed to fetch article:", err);
    res.status(500).json({ error: "Failed to fetch article", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 News back-end running at http://localhost:${port}`);
});