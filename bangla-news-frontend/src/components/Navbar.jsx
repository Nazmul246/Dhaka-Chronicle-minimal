import React, { useState } from "react";
import { SlCalender } from "react-icons/sl";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const date = new Date();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="navbar relative z-50 bg-gray-200">
        {/* Desktop + Tablet */}
        <ul className="hidden md:flex justify-between items-center pt-4 pb-4 px-4 lg:px-60">
          {/* Logo */}
          <a href="/">
            <li className="font-bold text-xl">
              <img
                src="/assets/img/Logo.png"
                width="200px"
                alt="Dhaka Chronicle Vault"
              />
            </li>
          </a>

          {/* Search bar */}
          <li>
            <div className="flex items-center border w-[400px] lg:w-[500px] focus-within:border-indigo-500 transition duration-300 pr-3 gap-2 bg-white border-gray-500/30 h-[46px] rounded-[5px] overflow-hidden">
              <input
                type="text"
                placeholder="Search news here...."
                className="w-full h-full pl-4 outline-none placeholder-gray-500 text-sm"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="22"
                height="22"
                viewBox="0 0 30 30"
                fill="#6B7280"
              >
                <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
              </svg>
            </div>
          </li>

          {/* Date + Hamburger */}
          <li className="flex items-center gap-8">
            <p className="flex items-center gap-2 text-sm text-[#0097b2] font-bold">
              <SlCalender />
              {date.toDateString()}
            </p>

            <button
              onClick={toggleMenu}
              className="text-2xl focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
            </button>
          </li>
        </ul>

        {/* Mobile version */}
        <div className="flex md:hidden flex-col gap-3 p-4">
          {/* Top Row: search */}
          <div className="w-full">
            <div className="flex items-center border w-full focus-within:border-indigo-500 transition duration-300 pr-3 gap-2 bg-white border-gray-500/30 h-[44px] rounded-[5px] overflow-hidden">
              <input
                type="text"
                placeholder="Search news here...."
                className="w-full h-full pl-4 outline-none placeholder-gray-500 text-sm"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="22"
                height="22"
                viewBox="0 0 30 30"
                fill="#6B7280"
              >
                <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
              </svg>
            </div>
          </div>

          {/* Second Row: logo and hamburger */}
          <div className="flex justify-between items-center">
            <a href="/">
              <img
                src="/assets/img/Logo.png"
                width="150px"
                alt="Dhaka Chronicle Vault"
              />
            </a>

            <button
              onClick={toggleMenu}
              className="text-2xl focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
            </button>
          </div>
        </div>

        {/* Dropdown menu */}
        <div
          className={`origin-top w-full bg-white shadow-md overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-60 py-4" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col lg:flex-row justify-center gap-6 text-gray-800 text-lg px-4">
            <li>
              <a
                href="/"
                className="hover:text-indigo-600 transition-all block py-1"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-indigo-600 transition-all block py-1"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-indigo-600 transition-all block py-1"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-indigo-600 transition-all block py-1"
              >
                FAQ's
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
