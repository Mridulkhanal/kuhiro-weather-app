import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-brand">Kuhiro ☁️</h1>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        {/* Future links like Forecast, About can go here */}
      </ul>
    </nav>
  );
};

export default Navbar;
