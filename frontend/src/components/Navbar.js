import React from "react";
import { API_BASE_URL } from './config';
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaSignOutAlt,
  FaSignInAlt,
  FaUtensils,
  FaStore,
  FaHome,
  FaFileInvoice,
} from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar({ isLoggedIn, logout, isRestaurantLoggedIn, restaurantLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <nav className={`navbar ${isHomePage ? "transparent-navbar" : "colored-navbar"}`}>
      <h1 className="logo" onClick={() => navigate("/")}>FoodieExpress</h1>

      <ul className="nav-links">
        <li><Link to="/"><FaHome /> Home</Link></li>
        <li><Link to="/dishes"><FaUtensils /> Dishes</Link></li>
        <li><Link to="/restaurants"><FaStore /> Restaurants</Link></li>
        <li><Link to="/cart"><FaShoppingCart /> Cart</Link></li>
        {isLoggedIn && <li><Link to="/orders"><FaFileInvoice /> Orders</Link></li>}
        <li>
          {isLoggedIn ? (
            <span onClick={logout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </span>
          ) : (
            <Link to="/login"><FaSignInAlt /> Login</Link>
          )}
        </li>
        <li>
          {isRestaurantLoggedIn ? (
            <span onClick={restaurantLogout} className="logout-btn">
              <FaSignOutAlt /> Restaurant Logout
            </span>
          ) : (
            <Link to="/restaurant/login"><FaSignInAlt /> Restaurant Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
