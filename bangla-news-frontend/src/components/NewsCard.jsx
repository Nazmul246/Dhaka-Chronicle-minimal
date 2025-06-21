import React from "react";
import { jsPDF } from "jspdf";
import "../fonts/kalpurush-normal"; // ✅ Imports and registers the font

const NewsCard = ({ data }) => {
  const handleDownloadPDF = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch(
        `http://localhost:4000/news/full?url=${encodeURIComponent(data.link)}`
      );
      if (!resp.ok) throw new Error(`Server sent ${resp.status}`);

      const { content } = await resp.json();
      if (!content) throw new Error("No article content");

      // ✅ Create PDF and use Bangla font
      const pdf = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4",
      });

      pdf.setFont("kalpurush", "normal");
      pdf.setFontSize(14);

      const pageWidth = pdf.internal.pageSize.getWidth() - 80;
      const body = pdf.splitTextToSize(content, pageWidth);

      // ✅ Handle Bangla title correctly
      const title = pdf.splitTextToSize(data.title, pageWidth);

      pdf.text(title, 40, 60);
      pdf.text(body, 40, 100);

      pdf.save(`${data.title.slice(0, 30)}.pdf`);
    } catch (err) {
      console.error("❌ Could not generate Bangla PDF:", err.message);
    }
  };

  return (
    <div
      className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-300 p-5 flex flex-col justify-between h-full"
      data-aos="fade-right"
    >
      <a
        href={data.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug line-clamp-2 font-notoSans">
          {data.title}
        </h3>
        <p className="text-base text-gray-700 mb-2 line-clamp-3 font-balooDa">
          {data.summary}
        </p>
        <div className="text-[#c0392b] mb-1 font-semibold font-balooDa text-[16px] capitalize">
          Source: <span className="">{data.source}</span>
        </div>
        <p className="text-sm text-gray-500">
          {new Date(data.pubDate).toLocaleString()}
        </p>
      </a>

      <button onClick={handleDownloadPDF} className="button-ones mt-4">
        <span className="button_lg">
          <span className="button_sl"></span>
          <span className="button_text">Download PDF</span>
        </span>
      </button>
    </div>
  );
};

export default NewsCard;
