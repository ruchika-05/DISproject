import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ isLoggedIn }) {
  return (
    <nav className="navbar">
      <h1 className="logo">FoodieExpress</h1>
      <ul className="nav-links">
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/restaurants">Restaurants</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li>
          <Link to="/login">
            {isLoggedIn ? "Logout" : "Login"}
          </Link>
        </li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
