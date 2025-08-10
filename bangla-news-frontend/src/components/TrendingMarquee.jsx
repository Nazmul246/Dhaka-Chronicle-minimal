import React, { useEffect, useState } from "react";

const TrendingMarquee = () => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        const response = await fetch("http://localhost:4000/news/trending");
        const data = await response.json();
        setTrendingNews(data.news || []);
      } catch (error) {
        console.error("Failed to fetch trending news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingNews();

    // Refresh trending news every 10 minutes
    const interval = setInterval(fetchTrendingNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTrendingClick = async (newsItem) => {
    try {
      // Track click for trending news too
      await fetch("http://localhost:4000/news/track-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newsId: newsItem.link,
          title: newsItem.title,
          category: newsItem.category,
          source: newsItem.source,
          clickedAt: new Date().toISOString(),
          fromTrending: true, // Flag to identify clicks from trending section
        }),
      });
    } catch (error) {
      console.error("Failed to track trending click:", error);
    }

    // Open link in new tab
    window.open(newsItem.link, "_blank");
  };

  if (loading || trendingNews.length === 0) {
    return null; // Don't show anything if no trending news
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 mb-6 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4">
            <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
              🔥 Trending
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="marquee-container">
              <div className="marquee-content">
                {trendingNews.map((item, index) => (
                  <span
                    key={`${item.link}-${index}`}
                    className="inline-block mr-12 cursor-pointer hover:text-yellow-200 transition-colors"
                    onClick={() => handleTrendingClick(item)}
                  >
                    <span className="font-semibold">{item.title}</span>
                    <span className="text-red-200 ml-2 text-sm">
                      ({item.clickCount} clicks)
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }

        .marquee-content {
          display: inline-block;
          animation: marquee 60s linear infinite;
          padding-left: 100%;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TrendingMarquee;
