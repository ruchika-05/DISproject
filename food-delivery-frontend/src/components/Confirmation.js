import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Confirmation.css';

const ConfirmationPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="confirmation-container">
        <div className="order-message">
            <span className="tick-mark">✅</span>
            <span>Order Confirmed!</span>
        </div>

      <p className="status">Your food is on its way! 🍔🍟</p>

      <div className="delivery-details">
        <h3>Delivery Personnel Details</h3>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Contact:</strong> 111-222-3333</p>
      </div>

      <div className="button-wrapper">
        <button className="back-btn" onClick={handleBackHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
