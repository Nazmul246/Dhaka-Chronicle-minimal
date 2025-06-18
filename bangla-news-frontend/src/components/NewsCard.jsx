import React from "react";

const NewsCard = ({ data }) => {
  const handleDownloadPDF = (e) => {
    e.preventDefault();
    const content = `
      Title: ${data.title}
      Summary: ${data.summary}
      Source: ${data.source}
      Published At: ${new Date(data.pubDate).toLocaleString()}
      Link: ${data.link}
    `;
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title.slice(0, 30)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-300 p-5 flex flex-col justify-between h-full">
      <a
        href={data.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1"
      >
        <h3 className="text-xl font-notoSans font-bold text-gray-900 mb-3 leading-snug line-clamp-2">
          {data.title}
        </h3>
        <p className="text-base text-gray-700 mb-2 font-balooDa line-clamp-3">
          {data.summary}
        </p>
        <div className="text-sm text-gray-600 mb-1 font-semibold">
          Source: <span className="text-gray-800">{data.source}</span>
        </div>
        <p className="text-sm text-gray-500">
          {new Date(data.pubDate).toLocaleString()}
        </p>
      </a>

      <button onClick={handleDownloadPDF} className="button-ones">
        <span className="button_lg">
          <span className="button_sl"></span>
          <span className="button_text">Download PDF</span>
        </span>
      </button>
    </div>
  );
};

export default NewsCard;
