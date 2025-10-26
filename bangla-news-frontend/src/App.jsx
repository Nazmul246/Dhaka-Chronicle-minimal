import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import CategoryNewsPage from "./components/CategoryNewsPage";
import SearchNews from "./components/SearchNews";
import NotFoundPage from "./components/NotFoundPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";
import "./index.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AboutUs from "./components/AboutUs";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Show Navbar and Footer only for non-admin pages */}
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryNewsPage />} />
        <Route path="/search" element={<SearchNews />} />

        {/* About */}
        <Route path="/about" element={<AboutUs />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

export default App;
