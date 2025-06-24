import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from './config';
import axios from 'axios';
import '../styles/Orders.css';

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        axios.get(`${API_BASE_URL}/orders/${userId}`)
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
                            <h3>Order #{order.id}</h3>
                            <p><strong>Restaurant:</strong> {order.restaurant_name || "Unknown"}</p>
                            <p><strong>Items:</strong> {order.items}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`status ${order.status?.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </p>

                            {(order.status === "On the way" || order.status === "Delivered") && order.delivery_person_name && (
                                <div className="delivery-info">
                                    <p>🛵 <strong>Delivery Partner:</strong> {order.delivery_person_name}</p>
                                    <p>📞 <strong>Contact:</strong> {order.delivery_person_phone}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;
