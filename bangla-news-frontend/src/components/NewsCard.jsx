import React from "react";

const NewsCard = ({ data }) => {
  console.log(data);
  return (
    <a
      href={data.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded p-4 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Removed image display */}
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{data.title}</h3>
      <p className="text-sm text-gray-700 line-clamp-2">{data.summary}</p>
      <p className="text-[18px] mt-1 text-black font-bold">{data.source}</p>

      <p className="text-sm text-gray-600">
        {new Date(data.pubDate).toLocaleString()}
      </p>
    </a>
  );
};

export default NewsCard;
