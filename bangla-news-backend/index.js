const express = require("express");
const Parser = require("rss-parser");
const cron = require("node-cron");
const cors = require("cors");

const app = express();
const port = 4000;
const parser = new Parser();

app.use(cors()); // Enable CORS for all origins

// RSS feed sources
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
    // "https://www.jugantor.com/rss.xml",
    "https://samakal.com/rss.xml",
    // "https://bangla.bdnews24.com/rss.xml",
  ],
};

// In-memory news cache
let newsCache = {
  binodon: [],
  kheladhula: [],
  topnews: [],
  lastUpdated: null,
};

// Fetch and cache news function with image extraction
async function fetchAndCacheNews() {
  console.log("Fetching news from RSS feeds...");

  async function fetchCategoryFeeds(feeds) {
    const allItems = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const source = feed.title || "Unknown source";

        feed.items.forEach((item) => {
          allItems.push({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            source,
            image:
              item.enclosure?.url || // Image from enclosure tag
              (item["media:content"] && item["media:content"]["$"]?.url) || // Media content image
              null,
            summary: item.contentSnippet || item.content || item.summary || "",
          });
        });
      } catch (error) {
        console.error(`Failed to fetch feed: ${feedUrl}`, error.message);
      }
    }

    return allItems;
  }

  newsCache.binodon = await fetchCategoryFeeds(rssFeeds.binodon);
  newsCache.kheladhula = await fetchCategoryFeeds(rssFeeds.kheladhula);
  newsCache.topnews = await fetchCategoryFeeds(rssFeeds.topnews);
  newsCache.lastUpdated = new Date();

  console.log("News fetched and cached at", newsCache.lastUpdated);
}

// Schedule daily update at 6AM
cron.schedule("0 6 * * *", () => {
  fetchAndCacheNews();
});

// Fetch once at startup
fetchAndCacheNews();

// API endpoint to serve all news categories
app.get("/news/all", (req, res) => {
  const { lastUpdated, ...categories } = newsCache;

  const combinedNews = Object.entries(categories)
    .filter(([key]) => key !== "lastUpdated")
    .flatMap(([category, items]) =>
      items.map((item) => ({
        ...item,
        category,
      }))
    );

  res.json({
    lastUpdated,
    news: combinedNews,
  });
});

app.listen(port, () => {
  console.log(`News backend running at http://localhost:${port}`);
});
