import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./Navbar.css";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("kuhiro_dark_mode");
    if (saved !== null) return saved === "true";

    // No preference saved → use time-based default
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  });

  const [unit, setUnit] = useState<"metric" | "imperial">(() => {
    return (localStorage.getItem("kuhiro_unit") as "metric" | "imperial") || "metric";
  });

  const { lang, toggleLang } = useLanguage();

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("kuhiro_dark_mode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("kuhiro_unit", unit);
  }, [unit]);

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">Kuhiro ☁️</h1>

      <ul className="navbar-links">
        <li><Link to="/">{lang === "ne" ? "गृहपृष्ठ" : "Home"}</Link></li>
        <li><Link to="/forecast">{lang === "ne" ? "पूर्वानुमान" : "Forecast"}</Link></li>
        <li><Link to="/map">{lang === "ne" ? "नक्शा" : "Map"}</Link></li>
      </ul>

      <div className="toggle-group">
        <button className="dark-toggle" onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button className="unit-toggle" onClick={() => setUnit(prev => prev === "metric" ? "imperial" : "metric")}>
          {unit === "metric" ? "°C" : "°F"}
        </button>

        <button className="lang-toggle" onClick={toggleLang}>
          {lang === "ne" ? "🇳🇵 नेपाली" : "🇺🇸 English"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;