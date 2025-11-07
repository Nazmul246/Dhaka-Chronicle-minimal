import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const SearchNews = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.streambriefing.com/news/search?q=${encodeURIComponent(
            query
          )}`
        );
        setResults(res.data.news);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Search Results for "{query}"
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : results.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((item, index) => (
            <div key={index} className="border rounded p-4">
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.source}</p>
              <p className="text-sm mb-2">{item.summary?.slice(0, 100)}...</p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm"
              >
                Read More
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchNews;
