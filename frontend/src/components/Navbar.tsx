import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("kuhiro_dark_mode") === "true";
  });

  const [unit, setUnit] = useState<"metric" | "imperial">(() => {
    return (localStorage.getItem("kuhiro_unit") as "metric" | "imperial") || "metric";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("kuhiro_dark_mode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("kuhiro_unit", unit);
    // Optionally: Reload page or notify components (see below for logic)
  }, [unit]);

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">Kuhiro ☁️</h1>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/forecast">Forecast</Link></li>
      </ul>

      <div className="toggle-group">
        <button className="dark-toggle" onClick={() => setDarkMode(prev => !prev)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button
          className="unit-toggle"
          onClick={() => setUnit(prev => (prev === "metric" ? "imperial" : "metric"))}
        >
          {unit === "metric" ? "°C" : "°F"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;