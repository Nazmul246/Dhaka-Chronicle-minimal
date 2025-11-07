import React from "react";
import { jsPDF } from "jspdf";
import "../fonts/kalpurush-normal";

const NewsCard = ({ data }) => {
  // Track click when user clicks on news link
  const handleNewsClick = async (e) => {
    try {
      // Send click tracking data to backend
      await fetch("https://api.streambriefing.com/news/track-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newsId: data.link, // Using link as unique identifier
          title: data.title,
          category: data.category,
          source: data.source,
          clickedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to track click:", error);
      // Don't prevent navigation even if tracking fails
    }
  };

  const handleDownloadPDF = async (e) => {
    e.preventDefault();

    try {
      console.log("Fetching content for URL:", data.link);

      const resp = await fetch(
        `https://api.streambriefing.com/news/full?url=${encodeURIComponent(data.link)}`
      );

      console.log("Response status:", resp.status);

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("Server error:", errorText);
        throw new Error(`Server sent ${resp.status}: ${errorText}`);
      }

      const responseData = await resp.json();
      console.log("Response data:", responseData);

      const { content, title, warning } = responseData;
      if (!content || content.length < 50)
        throw new Error("No sufficient article content found");

      if (warning) {
        console.warn("PDF generation warning:", warning);
      }

      console.log("Creating PDF with content length:", content.length);

      // Create a clean PDF with just title and content
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("Please allow popups for this site to download PDF");
        return;
      }

      printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title || data.title}</title>
          <style>
            body { 
              font-family: 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', Arial, sans-serif; 
              line-height: 1.8; 
              margin: 60px;
              font-size: 16px;
              color: #333;
            }
            h1 { 
              font-size: 24px; 
              margin-bottom: 30px;
              color: #1a1a1a;
              text-align: center;
              border-bottom: 2px solid #ddd;
              padding-bottom: 15px;
            }
            .content { 
              text-align: justify; 
              text-indent: 30px;
            }
            .source {
              margin-top: 40px;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #eee;
              padding-top: 15px;
            }
          </style>
        </head>
        <body>
          <h1>${title || data.title}</h1>
          <div class="content">${content}</div>
          <div class="source">
            <strong>Source:</strong> ${data.source}<br>
            <strong>Date:</strong> ${new Date(
              data.pubDate
            ).toLocaleDateString()}
          </div>
        </body>
      </html>
    `);
      printWindow.document.close();

      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    } catch (err) {
      console.error("❌ Full error details:", err);
      alert(`Failed to download PDF: ${err.message}`);
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
        onClick={handleNewsClick}
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
