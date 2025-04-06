import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/RestaurantDashboard.css';
import AddDish from './AddDish';

function RestaurantDashboard() {
    const [dishes, setDishes] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAddDish, setShowAddDish] = useState(false);

    const restaurantId = localStorage.getItem("restaurantId");

    useEffect(() => {
        fetchDishes();
        fetchOrders();
    }, []);

    const fetchDishes = () => {
        if (!restaurantId) return;
        axios.get(`http://localhost:5000/restaurant-menu/${restaurantId}`)
            .then((res) => setDishes(res.data))
            .catch((err) => console.error("Error fetching dishes", err));
    };

    const fetchOrders = () => {
        if (!restaurantId) return;
        axios.get(`http://localhost:5000/restaurant-orders/${restaurantId}`)
            .then((res) => setOrders(res.data))
            .catch((err) => console.error("Error fetching orders", err));
    };

    const handleAddDishClick = () => {
        setShowAddDish(true);
    };

    const handleDishAdded = () => {
        setShowAddDish(false);
        fetchDishes();
    };

    const toggleAvailability = (id, currentAvailability) => {
        const confirmToggle = window.confirm(
            `Are you sure you want to ${currentAvailability ? "mark as unavailable" : "mark as available"} this dish?`
        );
        if (!confirmToggle) return;

        axios.put(`http://localhost:5000/api/dishes/${id}/availability`, {
            availability: currentAvailability === 1 ? 0 : 1,
        })
            .then(() => fetchDishes())
            .catch((err) => console.error(err));
    };

    const updateStatus = async (orderId, newStatus) => {
        await axios.put(`http://localhost:5000/orders/${orderId}/status`, { status: newStatus });
        fetchOrders();
    };
    const allowedTransition = (current, next) => {
        const orderFlow = ["Preparing", "On the Way", "Delivered"];
        return orderFlow.indexOf(next) >= orderFlow.indexOf(current);
      };
    return (
        <div className="dashboard-container">
            <section className="section">
                <div className="section-header">
                    <h2>Your Menu</h2>
                    <button className="add-dish-btn" onClick={handleAddDishClick}>Add Dish</button>
                </div>

                {showAddDish && <AddDish onDishAdded={handleDishAdded} />}

                {dishes.length === 0 ? (
                    <p>No dishes added yet.</p>
                ) : (
                    <div className="dishes-list">
                        {dishes.map((dish) => (
                            <div key={dish.id} className="dish-card">
                                <img src={dish.image_url} alt={dish.dish_name} />
                                <h3>{dish.dish_name}</h3>
                                <p><strong>Price:</strong> ₹{dish.price}</p>
                                <p><strong>Available:</strong> {dish.availability ? "Yes" : "No"}</p>
                                <button onClick={() => toggleAvailability(dish.id, dish.availability)}>
                                    {dish.availability ? "Mark Unavailable" : "Mark Available"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="section">
                <h2>Your Orders</h2>
                {orders.length === 0 ? (
                    <p>No orders yet.</p>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <p><strong>Order ID:</strong> {order.id}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                <label htmlFor={`status-${order.id}`}>Update Status:</label>
                                <select
                                onChange={(e) => {
                                    const newStatus = e.target.value;
                                    if (allowedTransition(order.status, newStatus)) {
                                    updateStatus(order.id, newStatus);
                                    } else {
                                    alert("You cannot move back to a previous status.");
                                    }
                                }}
                                value={order.status}
                                >
                                <option value="Preparing" disabled={order.status !== "Preparing" && order.status !== "New"}>
                                    Preparing
                                </option>
                                <option value="On the Way" disabled={order.status === "Delivered"}>
                                    On the Way
                                </option>
                                <option value="Delivered" disabled={order.status !== "On the Way"}>
                                    Delivered
                                </option>
                                </select>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default RestaurantDashboard;
