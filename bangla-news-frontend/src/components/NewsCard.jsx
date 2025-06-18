import React from "react";
import { CgLayoutGrid } from "react-icons/cg";
import { jsPDF } from "jspdf";



const NewsCard = ({ data }) => {
//   const handleDownloadPDF = (e) => {
//     e.preventDefault();
//     const content = `
//       Title: ${data.title}
//       Summary: ${data.summary}
//       Source: ${data.source}
//       Published At: ${new Date(data.pubDate).toLocaleString()}
//       Link: ${data.link}
//     `;
//     const blob = new Blob([content], { type: "application/pdf" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${data.title.slice(0, 30)}.pdf`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };



const handleDownloadPDF = async (e) => {
  e.preventDefault();

  try {
    const resp = await fetch(
      `http://localhost:4000/news/full?url=${encodeURIComponent(data.link)}`
    );
    if (!resp.ok) throw new Error(`Server sent ${resp.status}`);

    const { content } = await resp.json();
    if (!content) throw new Error("No article content");

    /* 1️⃣  create the doc */
    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    /* 2️⃣  select the Bangla font you imported */
    pdf.setFont("NotoSansBengali", "normal");
    pdf.setFontSize(14);

    /* 3️⃣  Write title and body */
    const pageWidth = pdf.internal.pageSize.getWidth() - 80; // 40‑pt margins
    const body = pdf.splitTextToSize(content, pageWidth);

    pdf.text(data.title, 40, 60, { maxWidth: pageWidth, fontSize: 16 });
    pdf.text(body, 40, 90);

    /* 4️⃣  Save */
    pdf.save(`${data.title.slice(0, 30)}.pdf`);
  } catch (err) {
    console.error("Could not fetch or generate PDF:", err);
  }
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
