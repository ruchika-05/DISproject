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
import Confirmation from "./components/Confirmation";
import RestaurantLogin from './components/RestaurantLogin';
import RestaurantDashboard from "./components/RestaurantDashboard";
import Dishes from "./components/Dishes";
import Home from './components/Home';

function AppWrapper() {
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRestaurantAuthenticated, setIsRestaurantAuthenticated] = useState(false);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isAuthenticated") === "true";
    const restaurantLoggedIn = localStorage.getItem("isRestaurantAuthenticated") === "true";

    setIsAuthenticated(userLoggedIn);
    setIsRestaurantAuthenticated(restaurantLoggedIn);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  const restaurantLogin = () => {
    setIsRestaurantAuthenticated(true);
    localStorage.setItem("isRestaurantAuthenticated", "true");
    setRefresh(!refresh);
  };
  
  const restaurantLogout = () => {
    setIsRestaurantAuthenticated(false);
    localStorage.removeItem("isRestaurantAuthenticated");
    setRefresh(!refresh);
  };

  return (
    <Router>
      <div className="container">
        <Navbar 
          isLoggedIn={isAuthenticated}
          logout={logout}
          isRestaurantLoggedIn={isRestaurantAuthenticated}
          restaurantLogout={restaurantLogout}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:restaurantId" element={<Menu cart={cart} setCart={setCart} />} />
          <Route path="/menu-item/:menuId" element={<MenuItemDetails cart={cart} setCart={setCart} isAuthenticated={isAuthenticated} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} isAuthenticated={isAuthenticated} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant/login" element={<RestaurantLogin restaurantLogin={restaurantLogin} />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/dishes" element={<Dishes />} />
        </Routes>

      </div>
    </Router>
  );
}

export default AppWrapper;
