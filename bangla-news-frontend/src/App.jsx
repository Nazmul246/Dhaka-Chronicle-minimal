import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import CategoryNewsPage from "./components/CategoryNewsPage"; // new page for categories
import "./index.css";
import Footer from "./components/Footer";

function App() {
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
