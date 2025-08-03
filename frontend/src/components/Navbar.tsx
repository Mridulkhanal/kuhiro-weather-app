import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("kuhiro_dark_mode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("kuhiro_dark_mode", String(darkMode));
  }, [darkMode]);

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">Kuhiro ☁️</h1>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/forecast">Forecast</Link></li>
      </ul>

      <button className="dark-toggle" onClick={() => setDarkMode(prev => !prev)}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </nav>
  );
};

export default Navbar;