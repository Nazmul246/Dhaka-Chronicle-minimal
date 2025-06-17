import React, { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import HeroSection from "./HeroSection";

const Home = () => {
  const [newsData, setNewsData] = useState({}); // stores categorized news
  const [showAll, setShowAll] = useState({
    binodon: false,
    kheladhula: false,
    topnews: false,
  });

  useEffect(() => {
    fetch("http://localhost:4000/news/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);

        const categorized = {
          binodon:
            data.news?.filter((item) => item.category === "binodon") || [],
          kheladhula:
            data.news?.filter((item) => item.category === "kheladhula") || [],
          topnews:
            data.news?.filter((item) => item.category === "topnews") || [],
        };

        setNewsData(categorized);
      })
      .catch((err) => console.error("Failed to fetch news:", err));
  }, []);

  const toggleShowAll = (category) => {
    setShowAll((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const renderCategory = (categoryKey, displayName) => {
    const items = newsData[categoryKey] || [];
    const visibleItems = showAll[categoryKey] ? items : items.slice(0, 15);

    return (
      <section className="my-6">
        {/* 🔥 Skewed Heading Design for All Categories */}
        <div className="relative flex items-center mb-6">
          <div className="relative z-10 px-6 py-2 bg-[#1f2a44] text-white text-xl font-semibold transform -skew-x-6 shadow-md">
            <span className="inline-block transform skew-x-6">
              {displayName}
            </span>
          </div>
          <div className="absolute left-0 bottom-0 w-full h-1 bg-[#1f2a44]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map((item, idx) => (
            <NewsCard key={idx} data={item} />
          ))}
        </div>

        {items.length > 5 && (
          <button
            onClick={() => toggleShowAll(categoryKey)}
            className="mt-4 text-blue-600 hover:underline"
          >
            {showAll[categoryKey] ? "See Less" : "See More"}
          </button>
        )}
      </section>
    );
  };

  return (
    <div>
      <HeroSection />
      <div className="container mx-auto px-4">
        {renderCategory("topnews", "📰 Trending News")}
        {renderCategory("binodon", "🎬 Entertainments")}
        {renderCategory("kheladhula", "🏆 Sports")}
      </div>
    </div>
  );
};

export default Home;
