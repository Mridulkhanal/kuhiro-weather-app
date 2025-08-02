import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-brand">Kuhiro ☁️</h1>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/forecast">Forecast</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
