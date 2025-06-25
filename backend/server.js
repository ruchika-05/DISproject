require('dotenv').config(); // Add at the TOP of the file
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin || // allow requests from tools like Postman
      origin === "http://localhost:3000" || // local dev
      origin === "https://food-delivery-eight-bice.vercel.app" || // your frontend
      origin.endsWith(".vercel.app") // Vercel preview deployments
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD, // Now securely loaded from .env
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
});

const db=pool.promise();

pool.getConnection((err, connection) => {
  if (err) {
    console.error("DB Connection Error:", err);
  } else {
    console.log("Database connected!");
    connection.release();
  }
});
app.get("/", (req, res) => {
  res.send("Backend is live!");
});
// USER REGISTRATION
app.post("/register", async (req, res) => {
  const { name, email, phone, password, address, pincode, state } = req.body;

  if (!name || !email || !phone || !password || !address || !pincode || !state) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields." });
  }

  if (phone.length < 10) {
    return res.status(400).json({ success: false, message: "Phone number must be at least 10 digits." });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO users (name,email,phone,password,address,pincode,state) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, phone, password, address, pincode, state]
    );
    res.json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, message: "Email already exists." });
    }
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]);
    if (results.length > 0) {
      return res.json({ success: true, user: results[0] });
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET RESTAURANTS
app.get("/restaurants", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, address, contact_info, image_url FROM restaurants");
    res.json(rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});


//GET MENU FOR A RESTAURANT
app.get("/menu/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT id, dish_name, price, availability, image_url FROM menus WHERE restaurant_id = ? AND availability=TRUE",
      [restaurantId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET SINGLE MENU ITEM
app.get("/menu-item/:menuId", async (req, res) => {
  const { menuId } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM menus WHERE id = ?", [menuId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

//PLACE ORDER
app.post("/orders", async (req, res) => {
  const { user_id, restaurant_id, items } = req.body;
  const items_str = JSON.stringify(items);

  try {
    const [result] = await db.query(
      "INSERT INTO orders (user_id, restaurant_id, items, status, delivery_person_id) VALUES (?, ?, ?, 'Preparing', NULL)",
      [user_id, restaurant_id, items_str]
    );
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order_id: result.insertId,
    });
  } catch (err) {
    console.error("Order insert error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});


app.get("/orders/:userId", async (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      o.*, 
      r.name AS restaurant_name,
      d.name AS delivery_person_name,
      d.contact_info AS delivery_person_phone
    FROM orders o 
    JOIN restaurants r ON o.restaurant_id = r.id
    LEFT JOIN delivery_personnel d ON o.delivery_person_id = d.id
    WHERE o.user_id = ?
  `;

  try {
    const [result] = await db.query(sql, [userId]);
    res.json(result);
  } catch (err) {
    console.error("Error fetching orders with delivery info:", err);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

app.get("/restaurant-orders/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const [result] = await db.query("SELECT * FROM orders WHERE restaurant_id = ?", [restaurantId]);
    res.json(result);
  } catch (err) {
    console.error("Error fetching restaurant orders:", err);
    res.status(500).json({ error: "Failed to fetch restaurant orders" });
  }
});

app.post("/restaurant/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [result] = await db.query(
      "SELECT * FROM restaurants WHERE email = ? AND password = ?",
      [email, password]
    );

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const restaurant = result[0];
    res.json({
      message: "Login successful",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

app.post("/restaurant/add-dish", async (req, res) => {
  const { restaurant_id, dish_name, price, image_url, availability } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO menus (restaurant_id, dish_name, price, image_url, availability) VALUES (?, ?, ?, ?, ?)",
      [restaurant_id, dish_name, price, image_url, availability]
    );
    res.json({ message: "Dish added successfully" });
  } catch (err) {
    console.error("Error adding dish:", err);
    res.status(500).json({ error: "Failed to add dish" });
  }
});

app.get("/restaurant-menu/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const [results] = await db.query("SELECT * FROM menus WHERE restaurant_id = ?", [restaurantId]);
    res.json(results);
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
});

app.post("/restaurant/register", async (req, res) => {
  const { name, email, password, address, contact_info, image_url } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM restaurants WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const [result] = await db.query(
      "INSERT INTO restaurants (name, email, password, address, contact_info, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, password, address, contact_info, image_url]
    );

    res.json({ message: "Restaurant registered successfully", restaurantId: result.insertId });
  } catch (err) {
    console.error("Database error during registration:", err);
    res.status(500).json({ message: "Failed to register", error: err });
  }
});

app.put('/toggle-availability/:dishId', async (req, res) => {
  const { dishId } = req.params;
  const { availability } = req.body;

  try {
    const [result] = await db.query("UPDATE menus SET availability = ? WHERE id = ?", [availability, dishId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.json({ message: "Availability updated successfully" });
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({ error: "Failed to update availability" });
  }
});

app.put("/orders/:id/deliver", async (req, res) => {
  const { id } = req.params;

  try {
    const [orderResult] = await db.query("SELECT delivery_person_id FROM orders WHERE id = ?", [id]);
    if (orderResult.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const deliveryPersonId = orderResult[0].delivery_person_id;

    await db.query("UPDATE orders SET status = 'Delivered' WHERE id = ?", [id]);
    await db.query("UPDATE delivery_personnel SET available = TRUE WHERE id = ?", [deliveryPersonId]);

    res.json({ message: "Order marked as delivered and personnel freed" });
  } catch (err) {
    console.error("Error marking order as delivered:", err);
    res.status(500).json({ error: "Failed to deliver order" });
  }
});

app.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['Preparing', 'On the Way', 'Delivered'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    if (status === "On the Way") {
      const [deliveryResult] = await db.query(`
        SELECT id, name, contact_info
        FROM delivery_personnel
        WHERE available = TRUE
        ORDER BY RAND()
        LIMIT 1
      `);

      if (deliveryResult.length === 0) {
        return res.status(500).json({ error: "No delivery personnel available" });
      }

      const deliveryPerson = deliveryResult[0];

      await db.query("UPDATE orders SET status = ?, delivery_person_id = ? WHERE id = ?", [status, deliveryPerson.id, id]);
      await db.query("UPDATE delivery_personnel SET available = FALSE WHERE id = ?", [deliveryPerson.id]);

      res.json({ message: "Order is now on the way", deliveryPerson });
    } else if (status === "Delivered") {
      await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
      await db.query(`
        UPDATE delivery_personnel
        SET available = TRUE
        WHERE id = (SELECT delivery_person_id FROM orders WHERE id = ?)
      `, [id]);

      res.json({ message: "Order delivered successfully" });
    } else {
      await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
      res.json({ message: "Order status updated successfully" });
    }
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});


app.get('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(`
      SELECT 
        o.status,
        dp.name AS delivery_person_name,
        dp.contact_info AS delivery_person_contact
      FROM orders o
      LEFT JOIN delivery_personnel dp ON o.delivery_person_id = dp.id
      WHERE o.id = ?
    `, [id]);

    if (result.length === 0) return res.status(404).json({ error: 'Order not found' });

    const { status, delivery_person_name, delivery_person_contact } = result[0];

    const response = {
      status,
      deliveryPerson: delivery_person_name
        ? {
            name: delivery_person_name,
            phone: delivery_person_contact,
          }
        : null,
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching order status:", err);
    res.status(500).json({ error: 'Error fetching status' });
  }
});

app.get("/dishes", async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT m.*, r.name AS restaurant_name
      FROM menus m
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE m.availability=TRUE;
    `);
    res.json(result);
  } catch (err) {
    console.error("Error in /dishes route:", err);
    res.status(500).json({ error: "Failed to fetch dishes" });
  }
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query("SELECT address, pincode, state FROM users WHERE id = ?", [id]);
    if (results.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(results[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.put("/user/:id/address", async (req, res) => {
  const { id } = req.params;
  const { address, pincode, state } = req.body;
  try {
    await db.query(
      "UPDATE users SET address = ?, pincode = ?, state = ? WHERE id = ?",
      [address, pincode, state, id]
    );
    res.json({ message: "Address updated successfully" });
  } catch (err) {
    console.error("Error updating address:", err);
    res.status(500).json({ error: "Failed to update address" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
