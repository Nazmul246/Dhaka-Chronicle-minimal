import React from "react";

const SingleData = ({ singleDatas }) => {
  return (
    <div className="p-4 border rounded shadow-md hover:bg-gray-100 transition">
      <a href={singleDatas.link} target="_blank" rel="noopener noreferrer">
        <h2 className="text-lg font-semibold">{singleDatas.title}</h2>
      </a>
      <p className="text-sm text-gray-600">{singleDatas.pubDate}</p>
    </div>
  );
};

export default SingleData;
