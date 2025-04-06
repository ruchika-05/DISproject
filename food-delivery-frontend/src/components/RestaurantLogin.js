import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RestaurantLogin.css';
import { useNavigate,Link } from 'react-router-dom';

function RestaurantLogin({ restaurantLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/restaurant/login', {
        email,
        password,
      });

      const { restaurantId } = response.data;

      // Store restaurant ID locally
      localStorage.setItem('restaurantId', restaurantId);

      // 🔥 Update auth state in AppWrapper
      restaurantLogin();

      // Redirect to restaurant dashboard
      navigate('/restaurant-dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="restaurant-login-container">
      <h2>Restaurant Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter restaurant email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        <p style={{ marginTop: '1rem' }}>
        Don't have an account?{' '}
        <Link to="/restaurant/register">Register here</Link>
      </p>
      </form>
    </div>
  );
}

export default RestaurantLogin;
