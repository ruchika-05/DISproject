import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Restaurants from "./components/Restaurants";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Login from "./components/Login";
import MenuItemDetails from "./components/MenuItemDetails";
import Navbar from "./components/Navbar";
import "./App.css";
import Register from "./components/Register";


function AppWrapper() {
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // ✅ Single source of truth for login state

  useEffect(() => {
    const loggedIn = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(loggedIn);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <Router>
      <div className="container">
        {/* ✅ Pass isAuthenticated instead of isLoggedIn */}
        <Navbar isLoggedIn={isAuthenticated} logout={logout} />

        <Routes>
          <Route path="/" element={<Restaurants />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/menu/:restaurantId"
            element={<Menu cart={cart} setCart={setCart} />}
          />
          <Route
            path="/menu-item/:menuId"
            element={
              <MenuItemDetails
                cart={cart}
                setCart={setCart}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                setCart={setCart}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppWrapper;
