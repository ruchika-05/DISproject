import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Restaurants from "./components/Restaurants";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import MenuItemDetails from "./components/MenuItemDetails";
import Header from "./components/Header"; // New component for header
import "./styles.css";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <div>
        {/* Header Component (with "Go to Cart" button) */}
        <Header />

        {/* App Routes */}
        <Routes>
          <Route path="/" element={<Restaurants />} />
          <Route path="/menu/:restaurantId" element={<Menu />} />
          <Route path="/menu-item/:menuId" element={<MenuItemDetails cart={cart} setCart={setCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
