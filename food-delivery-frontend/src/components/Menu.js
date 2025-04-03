import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import navigate
import axios from "axios";

function Menu() {
    const { restaurantId } = useParams(); // Get restaurant ID from URL
    const [menu, setMenu] = useState([]);
    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
        axios.get(`http://localhost:5000/menu/${restaurantId}`)
            .then(res => setMenu(res.data))
            .catch(err => console.error(err));
    }, [restaurantId]);

    const handleMenuClick = (menuId) => {
        console.log("Navigating to menu item:", menuId); // Debugging
        navigate(`/menu-item/${menuId}`);
    };
    

    return (
        <div>
            <h2>Menu</h2>
            <div className="menu-list">
                {menu.map(item => (
                    <div 
                        key={item.id} 
                        className="menu-card" 
                        onClick={() => handleMenuClick(item.id)} // Click event
                        style={{ cursor: "pointer" }} // Add pointer cursor
                    >
                        <img src={item.image_url} alt={item.dish_name} className="menu-img" />
                        <h3>{item.dish_name}</h3>
                        <p>₹{item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Menu;
