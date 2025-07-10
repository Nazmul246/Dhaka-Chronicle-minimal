import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NewsCard from "./NewsCard";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";

const ITEMS_PER_PAGE = 20;

const categoryDisplayNames = {
  topnews: "📰 Trending News",
  binodon: "🎬 Entertainments",
  kheladhula: "🏆 Sports",
};

const CategoryNewsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedDate = queryParams.get("date"); // in YYYY-MM-DD format

  // Fetch news once component mounts or category changes
  useEffect(() => {
    setLoading(true);

    const fetchUrl = selectedDate
      ? `https://dhaka-chronicle-backend-production.up.railway.app/news/bydate?date=${selectedDate}`
      : "https://dhaka-chronicle-backend-production.up.railway.app/news/all";

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        const rawNews = data.news || [];

        let filteredNews = rawNews.filter(
          (item) =>
            item.category &&
            category &&
            item.category.toLowerCase() === category.toLowerCase()
        );

        // Fallback: if no news found for selectedDate, try /news/all instead
        if (selectedDate && filteredNews.length === 0) {
          return fetch(
            "https://dhaka-chronicle-backend-production.up.railway.app/news/all"
          )
            .then((res) => res.json())
            .then((fallbackData) => {
              const fallbackNews = fallbackData.news || [];
              const fallbackFiltered = fallbackNews.filter(
                (item) =>
                  item.category &&
                  category &&
                  item.category.toLowerCase() === category.toLowerCase()
              );
              setNewsList(fallbackFiltered);
            });
        } else {
          setNewsList(filteredNews);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch news:", err);
      })
      .finally(() => {
        setLoading(false);
        setCurrentPage(1);
      });
  }, [category, selectedDate]);

  // Pagination calculations
  const totalPages = Math.ceil(newsList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleItems = newsList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const displayName = categoryDisplayNames[category] || category;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Skewed Heading */}
      <div className="relative flex items-center mb-6">
        <div className="relative z-10 px-6 py-2 bg-[#1f2a44] text-white text-xl font-semibold transform -skew-x-6 shadow-md">
          <span className="inline-block transform skew-x-6">{displayName}</span>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-1 bg-[#1f2a44]"></div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : visibleItems.length === 0 ? (
        <p>No news found in this category.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleItems.map((item, idx) => (
              <NewsCard key={idx} data={item} />
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer hover:text-[#248afe] flex items-center gap-2"
            >
              <FaArrowCircleLeft />
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer hover:text-[#248afe] flex items-center gap-2"
            >
              Next <FaArrowCircleRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryNewsPage;
