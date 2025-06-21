import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import CategoryNewsPage from "./components/CategoryNewsPage"; // new page for categories
import "./index.css";
import Footer from "./components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800, // animation duration in ms
      once: true, // whether animation should happen only once
    });
  }, []);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryNewsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
