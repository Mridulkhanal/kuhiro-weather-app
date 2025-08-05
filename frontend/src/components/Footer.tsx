import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Kuhiro • Real-Time Weather App</p>
      <p>Made by Mridul Khanal</p>
    </footer>
  );
};

export default Footer;