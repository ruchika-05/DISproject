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

// ✅ USER REGISTRATION
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

// ✅ LOGIN
app.post("/api/login", (req, res) => {
    let { email, password } = req.body;

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

// ✅ GET RESTAURANTS
app.get("/restaurants", (req, res) => {
    db.query("SELECT id, name, address, contact_info, image_url FROM restaurants", (err, result) => {
        if (err) res.status(500).json(err);
        else res.json(result);
    });
});

// ✅ GET MENU FOR A RESTAURANT
app.get("/menu/:restaurantId", (req, res) => {
    const { restaurantId } = req.params;
    db.query(
        "SELECT id, dish_name, price, availability, image_url FROM menus WHERE restaurant_id = ?",
        [restaurantId],
        (err, result) => {
            if (err) res.status(500).json(err);
            else res.json(result);
        }
    );
});

// ✅ GET SINGLE MENU ITEM
app.get("/menu-item/:menuId", (req, res) => {
    const { menuId } = req.params;
    console.log("Fetching menu item with ID:", menuId);

    db.query("SELECT * FROM menus WHERE id = ?", [menuId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length === 0) {
            console.log("Menu item not found for ID:", menuId);
            return res.status(404).json({ message: "Menu item not found" });
        }
        console.log("Menu item found:", result[0]);
        res.json(result[0]);
    });
});

// ✅ PLACE ORDER
app.post("/orders", (req, res) => {
    const { user_id, restaurant_id, items } = req.body;

    db.query("SELECT id, name, contact_info FROM delivery_personnel ORDER BY RAND() LIMIT 1", (err, deliveryResult) => {
        if (err || deliveryResult.length === 0) {
            return res.status(500).json({ error: "No delivery personnel available" });
        }

        const deliveryPerson = deliveryResult[0];
        const delivery_person_id = deliveryPerson.id;
        const items_str = JSON.stringify(items);

        db.query(
            "INSERT INTO orders (user_id, restaurant_id, items, status, delivery_person_id) VALUES (?, ?, ?, ?, ?)",
            [user_id, restaurant_id, items_str, "Pending", delivery_person_id],
            (err, result) => {
                if (err) {
                    console.error("Order insert error:", err);
                    return res.status(500).json({ error: "Failed to place order" });
                }

                res.status(201).json({
                    success: true,
                    message: "Order placed successfully!",
                    order_id: result.insertId,
                    deliveryPerson: {
                        name: deliveryPerson.name,
                        contact_info: deliveryPerson.contact_info
                    }
                });
            }
        );
    });
});
app.get("/orders/:userId", (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT o.*, r.name AS restaurant_name 
        FROM orders o 
        JOIN restaurants r ON o.restaurant_id = r.id 
        WHERE o.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.get("/restaurant-orders/:restaurantId", (req, res) => {
    const { restaurantId } = req.params;

    const sql = `
        SELECT * FROM orders
        WHERE restaurant_id = ?
    `;

    db.query(sql, [restaurantId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// ✅ START SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
app.post("/restaurant/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM restaurants WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (result.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        // ✅ Success
        const restaurant = result[0];
        res.json({
            message: "Login successful",
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
        });
    });
});
app.post("/restaurant/add-dish", (req, res) => {
    const { restaurant_id, dish_name, price, image_url, availability } = req.body;

    const sql = `
        INSERT INTO menus (restaurant_id, dish_name, price, image_url, availability)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [restaurant_id, dish_name, price, image_url, availability], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Dish added successfully" });
    });
});
app.get('/restaurant-menu/:restaurantId', (req, res) => {
    const { restaurantId } = req.params;

    const sql = "SELECT * FROM menus WHERE restaurant_id = ?";
    db.query(sql, [restaurantId], (err, results) => {
        if (err) {
            console.error("Error fetching menu:", err);
            return res.status(500).json({ message: "Failed to fetch menu" });
        }
        res.json(results);
    });
});
app.put('/toggle-availability/:dishId', (req, res) => {
    const dishId = req.params.dishId;
    const availability = req.body.availability;

    const sql = "UPDATE menu SET availability = ? WHERE id = ?";
    db.query(sql, [availability, dishId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Availability updated");
    });
});

  
app.put("/api/orders/:id/deliver", (req, res) => {
    const { id } = req.params;
    const sql = `
        UPDATE orders
        SET status = 'Delivered'
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Order marked as delivered" });
    });
});

// Get all menu items with restaurant names
app.get("/dishes", (req, res) => {
    const sql = `
      SELECT m.*, r.name AS restaurant_name
      FROM menus m
      JOIN restaurants r ON m.restaurant_id = r.id
    `;
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error in /dishes route:", err);
        return res.status(500).json(err);
      }
      res.json(result);
    });
  });
  
  
