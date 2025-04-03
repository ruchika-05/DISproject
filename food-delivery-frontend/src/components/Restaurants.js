import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import navigation hook

function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
        axios.get("http://localhost:5000/restaurants")
            .then(res => setRestaurants(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleRestaurantClick = (id) => {
        navigate(`/menu/${id}`); // Navigate to menu page
    };

    return (
        <div>
            <h2>Restaurants</h2>
            <div className="restaurant-list">
                {restaurants.map(restaurant => (
                    <div 
                        key={restaurant.id} 
                        className="restaurant-card" 
                        onClick={() => handleRestaurantClick(restaurant.id)} // Click event
                        style={{ cursor: "pointer" }} // Add cursor effect
                    >
                        <img src={restaurant.image_url} alt={restaurant.name} className="restaurant-img" />
                        <h3>{restaurant.name}</h3>
                        <p>{restaurant.address}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Restaurants;
