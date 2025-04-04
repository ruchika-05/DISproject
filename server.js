const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 5000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ruchika@2327",
    database: "food_delivery"
});

db.connect(err => {
    if (err) {
        console.error("DB Connection Error:", err);
    } else {
        console.log("Database connected!");
    }
});

app.post("/api/register", (req, res) => {
    const { name, email, phone, password, address, pincode, state } = req.body;
  
    const sql =
      "INSERT INTO users (name, email, phone, password, address, pincode, state) VALUES (?, ?, ?, ?, ?, ?, ?)";
  
    db.query(sql, [name, email, phone, password, address, pincode, state], (err, result) => {
      if (err) {
        console.error("Registration error:", err);
        return res.json({ success: false, message: "Email already exists or error occurred." });
      }
      res.json({ success: true });
    });
  });
  
  
  
app.get("/restaurants", (req, res) => {
    db.query("SELECT id, name, address, contact_info, image_url FROM restaurants", (err, result) => {
        if (err) res.status(500).json(err);
        else res.json(result);
    });
});

// Fetch menu for a restaurant (Now includes image)
app.get("/menu/:restaurantId", (req, res) => {
    const { restaurantId } = req.params;
    db.query("SELECT id, dish_name, price, availability, image_url FROM menus WHERE restaurant_id = ?", 
    [restaurantId], 
    (err, result) => {
        if (err) res.status(500).json(err);
        else res.json(result);
    });
});
app.get("/menu-item/:menuId", (req, res) => {
    const { menuId } = req.params;
    console.log("Fetching menu item with ID:", menuId); // Debugging

    db.query("SELECT * FROM menus WHERE id = ?", [menuId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length === 0) {
            console.log("Menu item not found for ID:", menuId);
            return res.status(404).json({ message: "Menu item not found" });
        }
        console.log("Menu item found:", result[0]); // Log the response
        res.json(result[0]);
    });
});



// Place order & Assign Delivery Personnel
app.post("/orders", (req, res) => {
    const { user_id, restaurant_id, items } = req.body;

    // Fetch an available delivery person
    db.query("SELECT id FROM delivery_personnel ORDER BY RAND() LIMIT 1", (err, deliveryResult) => {
        if (err || deliveryResult.length === 0) {
            return res.status(500).json({ error: "No delivery personnel available" });
        }

        const delivery_person_id = deliveryResult[0].id;
        const items_str = JSON.stringify(items);

        // Insert the order
        db.query(
            "INSERT INTO orders (user_id, restaurant_id, items, status, delivery_person_id) VALUES (?, ?, ?, ?, ?)",
            [user_id, restaurant_id, items_str, "Pending", delivery_person_id],
            (err, result) => {
                if (err) res.status(500).json(err);
                else res.json({ message: "Order placed!", order_id: result.insertId, delivery_person_id });
            }
        );
    });
});

// Fetch user orders
app.get("/orders/:userId", (req, res) => {
    const { userId } = req.params;
    db.query("SELECT * FROM orders WHERE user_id = ?", [userId], (err, result) => {
        if (err) res.status(500).json(err);
        else res.json(result);
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
app.post("/api/login", (req, res) => {
    let { email, password } = req.body;
  
    // Trim inputs to avoid issues with spaces
    email = email.trim();
    password = password.trim();
  
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
      }
  
      if (results.length > 0) {
        return res.json({ success: true, user: results[0] });
      } else {
        return res.json({ success: false, message: "Invalid email or password" });
      }
    });
  });
  
  

