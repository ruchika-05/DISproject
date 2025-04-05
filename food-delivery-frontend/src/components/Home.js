import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <h1>Order Food Anytime, Anywhere 🍔</h1>
        <p>Your favourite meals delivered hot & fresh!</p>
        <button onClick={() => navigate('/restaurants')}>
          Explore Restaurants
        </button>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">🚀 Super Fast Delivery</div>
        <div className="feature-card">🍽️ Top Rated Restaurants</div>
        <div className="feature-card">💸 Affordable Prices</div>
        <div className="feature-card">🍕 Great Food, Always!</div>
      </section>

      {/* Popular Dishes Carousel */}
      {/* Popular Dishes Carousel */}
    <section className="popular-section">
    <h2>Popular Picks</h2>
    <div className="carousel">
        <div className="dish-card">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQXRnq7LzyIyeZ70VDLzZwKfsoR3-KMoKuaQ&s" alt="Big Mac" />
        <p>Big Mac</p>
        </div>
        <div className="dish-card">
        <img src="https://cdn.uengage.io/uploads/5/image-579987-1715686804.png" alt="Pepperoni Pizza" />
        <p>Pepperoni Pizza</p>
        </div>
        <div className="dish-card">
        <img src="https://cdn4.singleinterface.com/files/banner_images/34404/952_1624955497_wednesdaybucketmin.jpg" alt="Fried Chicken Bucket" />
        <p>Fried Chicken Bucket</p>
        </div>
        <div className="dish-card">
        <img src="https://s23209.pcdn.co/wp-content/uploads/2022/07/220602_DD_The-Best-Ever-Cheeseburger_267.jpg" alt="Cheeseburger" />
        <p>Cheeseburger</p>
        </div>
    </div>
    </section>


      {/* Footer */}
      <footer className="footer">
        © 2025 FoodExpress. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Home;
