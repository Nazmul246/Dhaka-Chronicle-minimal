import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/custom-datepicker.css";

const HeroSection = () => {
  const canvasRef = useRef(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 120;
    const mouse = { x: null, y: null };

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

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
      window.removeEventListener("mousemove", () => {});
    };
  }, []);

  return (
    <div>
      <div className="relative w-full h-[450px] overflow-hidden bg-gray-800">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 z-0 w-full h-full"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-10"></div>
        <div className="absolute inset-0 z-10 flex items-center justify-center flex-col">
          <h1 className="text-4xl text-center pb-10 text-white font-bold">
            All the News from Bangladesh
            <br />
            <span className="typing-animations"> One Place, Any Time.</span>
          </h1>

          {/* Modern Calendar Picker */}
          <div className="flex items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] border border-white/20 flex-wrap md:flex-nowrap">
            <div className="flex items-center gap-2 w-full">
              <label htmlFor="date" className="text-white text-xl">
                📅
              </label>
              <DatePicker
                id="date"
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="MMMM d, yyyy"
                className="bg-white/10 text-white border border-white/30 rounded-md px-3 py-2 w-[400px] text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                calendarClassName="modern-datepicker"
                popperPlacement="bottom-start"
              />
            </div>
            <button className="bg-white text-gray-800 font-medium px-5 py-2 rounded-md hover:bg-gray-200 transition text-sm shadow-md whitespace-nowrap mt-3 md:mt-0">
              Search News
            </button>
          </div>
        </div>
      </div>

      <div className="flex pt-4 pb-4 justify-evenly w-full items-center bg-[#1F2A44]">
        <h2 className="text-[20px] text-white">
          Hello World <br />
          Hello World
        </h2>
        <h2 className="text-[20px] text-white">
          Hello World <br />
          Hello World
        </h2>
        <h2 className="text-[20px] text-white">
          Hello World <br />
          Hello World
        </h2>
        <h2 className="text-[20px] text-white">
          Hello World <br />
          Hello World
        </h2>
      </div>
    </div>
  );
};

export default HeroSection;
