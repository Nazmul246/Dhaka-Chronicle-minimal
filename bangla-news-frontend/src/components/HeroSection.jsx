import React, { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/custom-datepicker.css";
import { TypeAnimation } from "react-type-animation";

const HeroSection = ({
  selectedDate,
  setSelectedDate,
  onFilter,
  siteTexts,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 60;
    const mouse = { x: null, y: null };

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const mouseMoveHandler = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", mouseMoveHandler);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1;
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * 1 - 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#00cc00";
        ctx.fill();
      }
    }

    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(203, 213, 225, 0.3)";
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        if (mouse.x && mouse.y) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connect();
      requestAnimationFrame(animate);
    }

    particles = Array.from({ length: particleCount }, () => new Particle());
    animate();

    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return (
    <div>
      <div className="relative w-full h-[450px] md:h-[500px] overflow-hidden bg-gray-800">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 z-0 w-full h-full"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-10"></div>

        {/* Content */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center flex-col px-4"
          data-aos="zoom-in"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-center pb-6 font-bold leading-snug sm:leading-normal text-white">
            {siteTexts?.homepageHeading || "All the News from Bangladesh"}
            <br />
            <TypeAnimation
              key={`${siteTexts?.animationText1}-${siteTexts?.animationText2}-${siteTexts?.animationText3}`} // 👈 forces re-render when text changes
              sequence={[
                siteTexts?.animationText1 || "One Place, Any Time.",
                2000,
                siteTexts?.animationText2 || "Real-time Breaking News.",
                2000,
                siteTexts?.animationText3 || "Your Daily Bangla Digest.",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-[#0cbfde] text-xl md:text-2xl font-semibold mt-2 block lg:text-4xl"
            />
          </h1>

          {/* Date Picker UI with Filter button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg w-full max-w-[620px] border border-white/20 mx-auto mt-4">
            <div className="flex items-center gap-2 w-full">
              <label htmlFor="date" className="text-white text-xl">
                📅
              </label>
              <DatePicker
                id="date"
                selected={
                  selectedDate instanceof Date && !isNaN(selectedDate)
                    ? selectedDate
                    : new Date()
                }
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM d, yyyy"
                maxDate={new Date()}
                className="bg-white/10 text-white border border-white/30 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-white/50 lg:w-[400px] sm:w-[600px]"
                calendarClassName="modern-datepicker"
                popperPlacement="bottom-start"
              />
            </div>

            {/* Filter News button */}
            <button
              onClick={onFilter}
              className="w-full sm:w-auto bg-white text-gray-800 font-medium px-5 py-2 rounded-md hover:bg-gray-200 transition text-sm shadow-md whitespace-nowrap cursor-pointer"
              type="button"
            >
              Filter News
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex flex-wrap gap-4 justify-evenly items-center bg-[#1F2A44] py-4 px-2 text-white text-sm md:text-base mobile-only">
        <div className="flex items-center gap-2 flex-col lg:flex-row md:flex-row">
          <img
            src="/assets/icons/icons8-newspaper-100.png"
            alt="Newspaper Icon"
            width="30px"
            height="30px"
            className="mr-1"
          />
          <span className="text-[14px] lg:text-[16px] md:text-[15px] text-center">
            {siteTexts?.feature1 || "20+ Top News-portal"}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-col lg:flex-row md:flex-row">
          <img
            src="/assets/icons/icons8-live-100.png"
            alt="Live Icon"
            width="30px"
            height="30px"
          />
          <span className="text-[14px] lg:text-[16px] md:text-[15px] text-center">
            {siteTexts?.feature2 || "Live News Updates"}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-col lg:flex-row md:flex-row">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-alphabet-bangla"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 12c.904 -.027 3 2 3 7" />
            <path d="M10 11c0 -.955 0 -2 .786 -2.677c1.262 -1.089 3.025 .55 3.2 2.06c.086 .741 -.215 3.109 -1.489 4.527c-.475 .53 -.904 .992 -1.711 1.074c-.75 .076 -1.364 -.122 -2.076 -.588c-1.138 -.743 -2.327 -1.997 -3.336 -3.73c-1.078 -1.849 -1.66 -3.113 -2.374 -5.666" />
            <path d="M7.37 7.072c.769 -.836 5.246 -4.094 8.4 -.202c.382 .472 .573 .708 .9 1.63c.326 .921 .326 1.562 .326 2.844v7.656" />
            <path d="M17 10c0 -1.989 1.5 -4 4 -4" />
          </svg>

          <span className="text-[14px] lg:text-[16px] md:text-[15px] text-center">
            {siteTexts?.feature3 || "Pure Bangla News"}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-col lg:flex-row md:flex-row">
          <img
            src="/assets/icons/icons8-repeat-one-100.png"
            alt="Update Icon Icon"
            width="30px"
            height="30px"
          />
          <span className="text-[14px] lg:text-[16px] md:text-[15px] text-center">
            {siteTexts?.feature4 || "Updated Every Hour"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
