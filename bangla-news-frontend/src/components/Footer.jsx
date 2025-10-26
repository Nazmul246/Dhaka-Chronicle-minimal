import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Footer = () => {
  const [siteTexts, setSiteTexts] = useState({});
  useEffect(() => {
    fetch("http://localhost:4000/news/site-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.texts) {
          setSiteTexts(data.texts);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch site config:", err);
      });
  }, []);

  return (
    <footer className="bg-[#1f2a44] text-white mt-12" data-aos="zoom-in">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-20">
        {/* Site Title / Description */}
        <div>
          <h2 className="text-2xl font-bold tracking-wide mb-4">
            {siteTexts?.footerTitle || "About Dhaka Chronicle"}
          </h2>
          <p className="text-sm leading-relaxed text-gray-300">
            {siteTexts?.footerDescription || "About Dhaka Chronicle"}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/category/topnews"
                className="hover:text-blue-400 transition"
              >
                Trending News
              </Link>
            </li>
            <li>
              <Link
                to="/category/binodon"
                className="hover:text-blue-400 transition"
              >
                Entertainment
              </Link>
            </li>
            <li>
              <Link
                to="/category/kheladhula"
                className="hover:text-blue-400 transition"
              >
                Sports
              </Link>
            </li>
          </ul>
        </div>

        {/* Policy Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Legal & Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Social / Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-blue-400 transition">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-[#bc1888] transition">
              <FaInstagram />
            </a>
            <a
              href="mailto:contact@dhakachronicle.com"
              className="hover:text-[#EA4335] transition"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-600 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Dhaka Chronicle. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
