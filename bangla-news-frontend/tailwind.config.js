/** @type {import('tailwindcss').Config} */
console.log("Tailwind config loaded");
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        bangla: ['"Noto Sans Bengali"', 'sans-serif'],
        banglaBaloda: ['"Baloo Da 2"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
