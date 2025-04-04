import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Orders.css';

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/orders?user_id=1')
            .then((res) => {
                setOrders(res.data);
            })
            .catch((err) => {
                console.error('Failed to fetch orders', err);
            });
    }, []);

    return (
        <div className="orders-container">
            <h2>Your Previous Orders</h2>
            {orders.length === 0 ? (
                <p className="no-orders">You haven’t placed any orders yet.</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order, index) => (
                        <div key={index} className="order-card">
                            <h3>Order #{order.order_id}</h3>
                            <p><strong>Restaurant:</strong> {order.restaurant_name}</p>
                            <p><strong>Items:</strong> {order.items.join(', ')}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;
