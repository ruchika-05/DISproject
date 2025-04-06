import React, { useState } from 'react';
import '../styles/RestaurantRegister.css';

const RestaurantRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    contact_info: '',
    image_url: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
  
    try {
      const res = await fetch('/restaurant/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setMessage(data.message || 'Registered successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          address: '',
          contact_info: '',
          image_url: ''
        });
      } else {
        setMessage(data.error || data.message || 'Registration failed. Please check your inputs.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="restaurant-register-container">
      <h2>Restaurant Registration</h2>
      <form onSubmit={handleSubmit} className="restaurant-register-form">
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact_info"
          placeholder="Contact Info"
          value={formData.contact_info}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="image_url"
          placeholder="Image URL (optional)"
          value={formData.image_url}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
      {message && <p className="register-message">{message}</p>}
    </div>
  );
};

export default RestaurantRegister;
