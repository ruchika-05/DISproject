import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroVideo from './food-video.mp4'; // make sure the file name is correct
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section with Video */}
      <div className="hero-container">
        <video autoPlay muted loop className="hero-video">
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="overlay">
          <h1>Order Food Anytime, Anywhere 🍔</h1>
          <p>Log in or Register to place orders, track deliveries, and enjoy your favorite meals.</p>
          <div className="top-right-buttons">
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
          <button className="register-btn" onClick={() => navigate('/register')}>Register</button>
        </div>
        </div>
      </div>

      {/* Pink Section */}
      <div className="pink-section">
        <h2>Find Your Favorite Restaurant</h2>
        <p>Your favourite meals delivered hot & fresh!🍕🍟</p>
        <button className='restaurant-btn' onClick={()=> navigate('/restaurants')}>Browse Restaurants</button>
      </div>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">🚀 Super Fast Delivery</div>
        <div className="feature-card">🍽️ Top Rated Restaurants</div>
        <div className="feature-card">💸 Affordable Prices</div>
        <div className="feature-card">🍕 Great Food, Always!</div>
      </section>

      {/* Popular Picks */}
      <section className="popular-section">
        <h2>Popular Picks</h2>
        <div className="carousel">
          {[
            {
              name: "Big Mac",
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQXRnq7LzyIyeZ70VDLzZwKfsoR3-KMoKuaQ&s"
            },
            {
              name: "Pepperoni Pizza",
              img: "https://cdn.uengage.io/uploads/5/image-579987-1715686804.png"
            },
            {
              name: "Fried Chicken Bucket",
              img: "https://cdn4.singleinterface.com/files/banner_images/34404/952_1624955497_wednesdaybucketmin.jpg"
            },
            {
              name: "Cheeseburger",
              img: "https://s23209.pcdn.co/wp-content/uploads/2022/07/220602_DD_The-Best-Ever-Cheeseburger_267.jpg"
            }
          ].map((dish, idx) => (
            <div key={idx} className="dish-card">
              <img src={dish.img} alt={dish.name} />
              <p>{dish.name}</p>
            </div>
          ))}
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
