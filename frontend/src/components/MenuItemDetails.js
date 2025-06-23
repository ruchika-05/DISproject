import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/MenuItemDetails.css';

function MenuItemDetails({ cart, setCart }) {
    const { menuId } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/menu-item/${menuId}`)
            .then(response => setItem(response.data))
            .catch(error => console.error('Failed to fetch menu item:', error));
    }, [menuId]);

    const handleAddToCart = () => {
        setCart([...cart, item]);
        alert('Item added to cart!');
    };

    if (!item) return <div className="loading">Loading...</div>;

    return (
        <div className="item-details-container">
            <div className="item-image">
                <img src={item.image_url} alt={item.dish_name} />
            </div>
            <div className="item-content">
                <h2>{item.dish_name}</h2>
                <p><strong>Price:</strong> ₹{item.price}</p>
                <p><strong>Available:</strong> {item.availability ? 'Yes' : 'No'}</p>
                <button onClick={handleAddToCart}>Add to Cart</button>
            </div>
        </div>
    );
}

export default MenuItemDetails;
