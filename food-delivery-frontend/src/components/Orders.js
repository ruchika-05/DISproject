import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Orders.css';

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) return;

        axios.get(`http://localhost:5000/orders/${userId}`)
            .then((res) => {
                console.log("Fetched orders:", res.data);
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
                            <h3>Order #{order.id}</h3>
                            <p><strong>Restaurant:</strong> {order.restaurant_name || "Unknown"}</p>
                            <p><strong>Items:</strong> {order.items}</p>
                            <p>
                            <strong>Status:</strong>{" "}
                            <span className={`status ${order.status.toLowerCase()}`}>
                                {order.status}
                            </span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;
