import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/orders/1") // Replace 1 with actual user ID
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Your Orders</h2>
            {orders.length === 0 ? <p>No orders found.</p> : (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            <strong>Order #{order.id}</strong> <br />
                            Status: {order.status} <br />
                            Delivery Person: {order.delivery_person_id}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Orders;
