import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext"; 
import WeatherMap from "./pages/WeatherMap";
import "./index.css";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <div className="container" style={{ minHeight: "calc(100vh - 150px)" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/map" element={<WeatherMap />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </LanguageProvider>
  );
}

export default App;