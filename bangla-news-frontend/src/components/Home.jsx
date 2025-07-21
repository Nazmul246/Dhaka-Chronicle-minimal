import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewsCard from "./NewsCard";
import HeroSection from "./HeroSection";

const Home = () => {
  const [newsData, setNewsData] = useState({}); // all news categorized
  const [filteredNews, setFilteredNews] = useState({}); // filtered news by date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAll, setShowAll] = useState({
    binodon: false,
    kheladhula: false,
    topnews: false,
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const navigate = useNavigate();

  // Fetch all news once on mount
  useEffect(() => {
    setLoading(true);

    fetch("https://dhaka-chronicle-backend-production.up.railway.app/news/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("📥 Received data:", data.stats); // Debug log

        const categorized = {
          binodon:
            data.news?.filter((item) => item.category === "binodon") || [],
          kheladhula:
            data.news?.filter((item) => item.category === "kheladhula") || [],
          topnews:
            data.news?.filter((item) => item.category === "topnews") || [],
        };

        console.log("📊 Categorized counts:", {
          binodon: categorized.binodon.length,
          kheladhula: categorized.kheladhula.length,
          topnews: categorized.topnews.length,
        });

        setNewsData(categorized);
        setFilteredNews(categorized); // initially show all news
        setStats(data.stats || {});
      })
      .catch((err) => {
        console.error("Failed to fetch news:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter news by selectedDate when Filter button is clicked
  const handleFilterNews = () => {
    if (!selectedDate) {
      setFilteredNews(newsData); // if no date selected, reset
      return;
    }

    // Helper function to check if news item date matches selectedDate (ignore time)
    const isSameDay = (date1, date2) => {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    };

    const filtered = {};
    Object.keys(newsData).forEach((category) => {
      filtered[category] = newsData[category].filter((item) =>
        item.pubDate ? isSameDay(item.pubDate, selectedDate) : false
      );
    });

    console.log("🔍 Filtered results:", {
      binodon: filtered.binodon.length,
      kheladhula: filtered.kheladhula.length,
      topnews: filtered.topnews.length,
    });

    setFilteredNews(filtered);
  };

  const toggleShowAll = (category) => {
    setShowAll((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const renderCategory = (categoryKey, displayName) => {
    const items = filteredNews[categoryKey] || [];
    const visibleItems = showAll[categoryKey] ? items : items.slice(0, 6);
    const totalInCategory = items.length;

    return (
      <section className="my-6" key={categoryKey}>
        <div className="relative flex items-center mb-6">
          <div className="relative z-10 px-6 py-2 bg-[#1f2a44] text-white text-xl font-semibold transform -skew-x-6 shadow-md">
            <span className="inline-block transform skew-x-6">
              {displayName} ({totalInCategory} news)
            </span>
          </div>
          <div className="absolute left-0 bottom-0 w-full h-1 bg-[#1f2a44]"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f2a44]"></div>
          </div>
        ) : totalInCategory === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No news found in this category for the selected date.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleItems.map((item, idx) => (
                <NewsCard
                  key={`${categoryKey}-${idx}-${item.link}`}
                  data={item}
                />
              ))}
            </div>

            {totalInCategory > 6 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() =>
                    navigate(
                      `/category/${categoryKey}?date=${
                        selectedDate.toISOString().split("T")[0]
                      }`
                    )
                  }
                  className="relative inline-flex items-center px-6 py-2 mt-4 text-blue-600 border border-blue-600 rounded-full group overflow-hidden transition-all duration-300 ease-out hover:bg-blue-600 hover:text-white cursor-pointer"
                >
                  <span className="absolute left-0 w-full h-0 transition-all duration-300 ease-out transform -translate-y-full bg-blue-600 group-hover:h-full group-hover:translate-y-0"></span>
                  <span className="relative z-10 font-semibold tracking-wide">
                    See All {totalInCategory} News
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    );
  };

  return (
    <div>
      <HeroSection
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onFilter={handleFilterNews}
      />
      <div className="container mx-auto px-4">
        {/* Debug information - remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold">Debug Info:</h3>
            <p>Total News Cached: {stats.total || 0}</p>
            <p>
              Binodon: {stats.binodon || 0}, Kheladhula: {stats.kheladhula || 0}
              , Topnews: {stats.topnews || 0}
            </p>
            <p>
              Currently Showing: Binodon: {filteredNews.binodon?.length || 0},
              Kheladhula: {filteredNews.kheladhula?.length || 0}, Topnews:{" "}
              {filteredNews.topnews?.length || 0}
            </p>
          </div>
        )}

        {renderCategory("topnews", "📰 Trending News")}
        {renderCategory("binodon", "🎬 Entertainments")}
        {renderCategory("kheladhula", "🏆 Sports")}
      </div>
    </div>
  );
};

export default Home;
