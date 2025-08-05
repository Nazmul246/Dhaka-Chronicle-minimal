import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NewsCard from "./NewsCard";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";

const ITEMS_PER_PAGE = 20;

const categoryDisplayNames = {
  topnews: "📰 Trending News",
  binodon: "🎬 Entertainments",
  kheladhula: "🏆 Sports",
  rajniti: "🏛️ Politics",
  orthoniti: "💰 Economy",
  projukti: "💻 Technology",
  aantorjatik: "🌍 International",
  swasthya: "🏥 Health",
};

const CategoryNewsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedDate = queryParams.get("date"); // in YYYY-MM-DD format

  // Fetch news once component mounts or category changes
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);

    // First, try to use the new category-specific endpoint
    const categoryUrl = `http://localhost:4000/news/category/${category}`;

    const fetchUrl = selectedDate
      ? `http://localhost:4000/news/bydate?date=${selectedDate}`
      : categoryUrl;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        let filteredNews = [];

        if (selectedDate) {
          // When filtering by date, we need to filter by category
          const rawNews = data.news || [];
          filteredNews = rawNews.filter(
            (item) =>
              item.category &&
              category &&
              item.category.toLowerCase() === category.toLowerCase()
          );
        } else {
          // When using category endpoint, news is already filtered
          filteredNews = data.news || [];
        }

        // Fallback: if no news found for selectedDate, try /news/all instead
        if (selectedDate && filteredNews.length === 0) {
          return fetch(categoryUrl)
            .then((res) => res.json())
            .then((fallbackData) => {
              const fallbackNews = fallbackData.news || [];
              setNewsList(fallbackNews);
              setTotalItems(fallbackNews.length);
            });
        } else {
          setNewsList(filteredNews);
          setTotalItems(data.total || filteredNews.length);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch news:", err);
        setNewsList([]);
        setTotalItems(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, selectedDate]);

  // Pagination calculations
  const totalPages = Math.ceil(newsList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleItems = newsList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const displayName = categoryDisplayNames[category] || category;

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Skewed Heading */}
      <div className="relative flex items-center mb-6">
        <div className="relative z-10 px-6 py-2 bg-[#1f2a44] text-white text-xl font-semibold transform -skew-x-6 shadow-md">
          <span className="inline-block transform skew-x-6">
            {displayName}
            {!loading && ` (${newsList.length} news)`}
            {selectedDate && ` - ${selectedDate}`}
          </span>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-1 bg-[#1f2a44]"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1f2a44]"></div>
          <span className="ml-4 text-lg">Loading news...</span>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold mb-2">No news found</h3>
          <p className="text-gray-600 mb-4">
            {selectedDate
              ? `No news found in this category for ${selectedDate}`
              : `No news found in this category`}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-[#1f2a44] text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {visibleItems.map((item, idx) => (
              <NewsCard
                key={`${category}-${currentPage}-${idx}-${item.link}`}
                data={item}
              />
            ))}
          </div>

          {/* Enhanced Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2 flex-wrap">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 flex items-center gap-2 transition-colors"
              >
                <FaArrowCircleLeft />
                Prev
              </button>

              {/* First page */}
              {getPageNumbers()[0] > 1 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    1
                  </button>
                  {getPageNumbers()[0] > 2 && <span className="px-2">...</span>}
                </>
              )}

              {/* Page numbers */}
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded transition-colors ${
                    currentPage === pageNum
                      ? "bg-[#1f2a44] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Last page */}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                  {getPageNumbers()[getPageNumbers().length - 1] <
                    totalPages - 1 && <span className="px-2">...</span>}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 flex items-center gap-2 transition-colors"
              >
                Next <FaArrowCircleRight />
              </button>
            </div>
          )}

          {/* Results summary */}
          <div className="text-center mt-4 text-gray-600">
            Showing {startIndex + 1}-
            {Math.min(startIndex + ITEMS_PER_PAGE, newsList.length)} of{" "}
            {newsList.length} news articles
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryNewsPage;
