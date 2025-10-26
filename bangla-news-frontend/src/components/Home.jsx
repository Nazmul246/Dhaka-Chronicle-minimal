import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewsCard from "./NewsCard";
import HeroSection from "./HeroSection";
import TrendingMarquee from "./TrendingMarquee";

const Home = () => {
  const [newsData, setNewsData] = useState({});
  const [filteredNews, setFilteredNews] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAll, setShowAll] = useState({
    binodon: false,
    kheladhula: false,
    topnews: false,
    rajniti: false,
    orthoniti: false,
    projukti: false,
    aantorjatik: false,
    swasthya: false,
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [categoryNames, setCategoryNames] = useState({});
  const [siteTexts, setSiteTexts] = useState({});

  const navigate = useNavigate();

  // Helper function to diversify news sources
  const diversifyNewsSources = (newsArray, maxItemsToShow = 6) => {
    if (newsArray.length === 0) return [];

    const englishSources = [
      "The Daily Star",
      "The Business Standard",
      "TBS News",
      "Dhaka Tribune",
    ];

    const englishNews = newsArray.filter((item) =>
      englishSources.some(
        (source) =>
          item.source?.toLowerCase().includes(source.toLowerCase()) ||
          item.feedUrl?.includes("thedailystar.net") ||
          item.feedUrl?.includes("tbsnews.net") ||
          item.feedUrl?.includes("dhakatribune.com")
      )
    );

    const banglaNews = newsArray.filter(
      (item) =>
        !englishSources.some(
          (source) =>
            item.source?.toLowerCase().includes(source.toLowerCase()) ||
            item.feedUrl?.includes("thedailystar.net") ||
            item.feedUrl?.includes("tbsnews.net") ||
            item.feedUrl?.includes("dhakatribune.com")
        )
    );

    const banglaBySource = {};
    banglaNews.forEach((item) => {
      const source = item.source || "Unknown";
      if (!banglaBySource[source]) {
        banglaBySource[source] = [];
      }
      banglaBySource[source].push(item);
    });

    const sortedBanglaSources = Object.keys(banglaBySource).sort(
      (a, b) => banglaBySource[b].length - banglaBySource[a].length
    );

    const diverseNews = [];
    const maxPerSource = Math.max(
      1,
      Math.floor((maxItemsToShow - 1) / Math.min(5, sortedBanglaSources.length))
    );

    let sourcesUsed = 0;
    for (const source of sortedBanglaSources) {
      if (sourcesUsed >= 5) break;

      const sourceNews = banglaBySource[source]
        .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
        .slice(0, maxPerSource);

      diverseNews.push(...sourceNews);
      sourcesUsed++;
    }

    if (englishNews.length > 0) {
      const latestEnglish = englishNews.sort(
        (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
      )[0];
      diverseNews.push(latestEnglish);
    }

    return diverseNews
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, maxItemsToShow);
  };

  // Fetch site configuration (category names, etc.)
  useEffect(() => {
    fetch("http://localhost:4000/news/site-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.texts) {
          setCategoryNames(data.texts.categoryNames || {});
          setSiteTexts(data.texts);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch site config:", err);
      });
  }, []);

  // Fetch all news once on mount
  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:4000/news/all")
      .then((res) => res.json())
      .then((data) => {
        const categorized = {
          binodon:
            data.news?.filter((item) => item.category === "binodon") || [],
          kheladhula:
            data.news?.filter((item) => item.category === "kheladhula") || [],
          topnews:
            data.news?.filter((item) => item.category === "topnews") || [],
          rajniti:
            data.news?.filter((item) => item.category === "rajniti") || [],
          orthoniti:
            data.news?.filter((item) => item.category === "orthoniti") || [],
          projukti:
            data.news?.filter((item) => item.category === "projukti") || [],
          aantorjatik:
            data.news?.filter((item) => item.category === "aantorjatik") || [],
          swasthya:
            data.news?.filter((item) => item.category === "swasthya") || [],
        };

        setNewsData(categorized);
        setFilteredNews(categorized);
        setStats(data.stats || {});
      })
      .catch((err) => {
        console.error("Failed to fetch news:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleFilterNews = () => {
    if (!selectedDate) {
      setFilteredNews(newsData);
      return;
    }

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

    setFilteredNews(filtered);
  };

  const toggleShowAll = (category) => {
    setShowAll((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const renderCategory = (categoryKey, defaultDisplayName) => {
    const items = filteredNews[categoryKey] || [];

    // Use dynamic category name from admin config, fallback to default
    const displayName = categoryNames[categoryKey] || defaultDisplayName;

    const diverseItems = diversifyNewsSources(items, 6);
    const visibleItems = showAll[categoryKey] ? items : diverseItems;
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

            {totalInCategory > 6 && !showAll[categoryKey] && (
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
        siteTexts={siteTexts}
      />

      <TrendingMarquee />

      <div className="container mx-auto px-4">
        {renderCategory("topnews", "🔰 Trending News")}
        {renderCategory("rajniti", "🏛️ Politics")}
        {renderCategory("orthoniti", "💰 Economy")}
        {renderCategory("binodon", "🎬 Entertainments")}
        {renderCategory("kheladhula", "🏆 Sports")}
        {renderCategory("projukti", "💻 Technology")}
        {renderCategory("aantorjatik", "🌍 International")}
        {renderCategory("swasthya", "🏥 Health")}
      </div>
    </div>
  );
};

export default Home;
