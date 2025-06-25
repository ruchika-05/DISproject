require('dotenv').config(); // Add at the TOP of the file
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin || // allow non-browser tools like Postman
      origin === "http://localhost:3000" ||
      origin === "https://food-delivery-eight-bice.vercel.app" ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
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

app.get("/", (req, res) => {
  res.send("Backend is live!");
});
// USER REGISTRATION
app.post("/register", (req, res) => {
    const { name, email, phone, password, address, pincode, state } = req.body;

    if (!name||!email||!phone||!password||!address||!pincode||!state) {
      return res.status(400).json({success: false, message:"Please fill in all required fields." });
    }
  
    if (phone.length < 10) {
      return res.status(400).json({success: false, message:"Phone number must be at least 10 digits." });
    }
  
    if (password.length < 6) {
      return res.status(400).json({ success: false, message:"Password must be at least 6 characters." });
    }
  
    const sql =
      "INSERT INTO users (name,email,phone,password,address,pincode,state) VALUES (?, ?, ?, ?, ?, ?, ?)";
  
    db.query(sql, [name, email, phone, password, address, pincode, state], (err, result) => {
      if (err) {
        console.error("Registration error:", err);
  
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ success: false, message: "Email already exists." });
        }
  
        return res.status(500).json({ success: false, message: "Server error. Please try again later." });
      }
  
      res.json({ success: true, message: "Registration successful!" });
    });
  });

// LOGIN
app.post("/login", (req, res) => {
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
app.get("/menu/:restaurantId", (req, res) => {
    const { restaurantId } = req.params;
    db.query(
        "SELECT id, dish_name, price, availability, image_url FROM menus WHERE restaurant_id = ? && availability=TRUE",
        [restaurantId],
        (err, result) => {
            if (err) res.status(500).json(err);
            else res.json(result);
        }
    );
});

//GET SINGLE MENU ITEM
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

//PLACE ORDER
app.post("/orders", (req, res) => {
    const { user_id, restaurant_id, items } = req.body;
    const items_str = JSON.stringify(items);

    const insertOrderSql = `
        INSERT INTO orders (user_id, restaurant_id, items, status, delivery_person_id)
        VALUES (?, ?, ?, 'Preparing', NULL)
    `;

    db.query(insertOrderSql, [user_id, restaurant_id, items_str], (err, result) => {
        if (err) {
            console.error("Order insert error:", err);
            return res.status(500).json({ error: "Failed to place order" });
        }

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order_id: result.insertId,
        });
    });
});


app.get("/orders/:userId", (req, res) => {
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

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching orders with delivery info:", err);
            return res.status(500).json(err);
        }
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

//START SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
app.post("/restaurant/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM restaurants WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (result.length === 0) return res.status(401).json({ message: "Invalid credentials" });

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

app.post("/restaurant/register", (req, res) => {
    const { name, email, password, address, contact_info, image_url } = req.body;
  
    const checkSql = "SELECT * FROM restaurants WHERE email = ?";
    db.query(checkSql, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
  
      if (result.length > 0) {
        return res.status(409).json({ message: "Email already exists" });
      }
  
      const sql = `
        INSERT INTO restaurants (name, email, password, address, contact_info, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
  
      db.query(sql, [name, email, password, address, contact_info, image_url], (err, result) => {
        if (err) {
          console.error("Database error during insertion:", err); // <-- Important!
          return res.status(500).json({ message: "Failed to register", error: err });
        }
        res.json({ message: "Restaurant registered successfully", restaurantId: result.insertId });
      });
    });
});
  app.put('/toggle-availability/:dishId', (req, res) => {
    const { dishId } = req.params;
    const { availability } = req.body;

    const sql = "UPDATE menus SET availability = ? WHERE id = ?";
    db.query(sql, [availability, dishId], (err, result) => {
        if (err) {
            console.error("Error updating availability:", err);
            return res.status(500).json({ error: "Failed to update availability" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Dish not found" });
        }

        res.json({ message: "Availability updated successfully" });
    });
});
  
app.put("/orders/:id/deliver", (req, res) => {
    const { id } = req.params;

    const getDeliverySql = `SELECT delivery_person_id FROM orders WHERE id = ?`;

    db.query(getDeliverySql, [id], (err, result) => {
        if (err || result.length === 0) {
            return res.status(500).json({ error: "Failed to find order" });
        }

        const deliveryPersonId = result[0].delivery_person_id;

        const updateOrderSql = `
            UPDATE orders SET status = 'Delivered' WHERE id = ?
        `;

        db.query(updateOrderSql, [id], (err) => {
            if (err) return res.status(500).json(err);

            const updatePersonnelSql = `
                UPDATE delivery_personnel SET available = TRUE WHERE id = ?
            `;
            db.query(updatePersonnelSql, [deliveryPersonId], (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Order marked as delivered and personnel freed" });
            });
        });
    });
});

app.put('/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Preparing', 'On the Way', 'Delivered'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    if (status === "On the Way") {
        const findPersonnelSql = `
            SELECT id, name, contact_info 
            FROM delivery_personnel 
            WHERE available = TRUE 
            ORDER BY RAND() 
            LIMIT 1
        `;

        db.query(findPersonnelSql, (err, deliveryResult) => {
            if (err || deliveryResult.length === 0) {
                return res.status(500).json({ error: "No delivery personnel available" });
            }

            const deliveryPerson = deliveryResult[0];
            const delivery_person_id = deliveryPerson.id;

            const updateOrderSql = `
                UPDATE orders SET status=?, delivery_person_id = ? WHERE id = ?
            `;
            db.query(updateOrderSql, [status, delivery_person_id, id], (err) => {
                if (err) return res.status(500).json({ error: "Failed to update status" });

                const updatePersonnelSql = `
                    UPDATE delivery_personnel SET available = FALSE WHERE id = ?
                `;
                db.query(updatePersonnelSql, [delivery_person_id], (err) => {
                    if (err) return res.status(500).json(err);
                    res.json({ message: "Order is now on the way", deliveryPerson });
                });
            });
        });
    } else if (status === "Delivered") {
        // Just update the status and release delivery personnel if assigned
        const updateQuery = `UPDATE orders SET status = ? WHERE id = ?`;
        db.query(updateQuery, [status, id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to update status" });

            const freeDeliveryPersonSql = `
                UPDATE delivery_personnel 
                SET available = TRUE 
                WHERE id = (SELECT delivery_person_id FROM orders WHERE id = ?)
            `;
            db.query(freeDeliveryPersonSql, [id], (err) => {
                if (err) console.log("Could not update delivery personnel availability");
                res.json({ message: "Order delivered successfully" });
            });
        });
    } else {
        const updateQuery = `UPDATE orders SET status = ? WHERE id = ?`;
        db.query(updateQuery, [status, id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to update status" });
            res.json({ message: "Order status updated successfully" });
        });
    }
});

app.get('/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT 
        o.status,
        dp.name AS delivery_person_name,
        dp.contact_info AS delivery_person_contact
      FROM orders o
      LEFT JOIN delivery_personnel dp ON o.delivery_person_id = dp.id
      WHERE o.id = ?
    `;
  
    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error fetching status' });
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
    });
});
  
// Get all menu items with restaurant names
app.get("/dishes", (req, res) => {
    const sql = `
      SELECT m.*, r.name AS restaurant_name
      FROM menus m
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE m. availability=TRUE;
    `;
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error in /dishes route:", err);
        return res.status(500).json(err);
      }
      res.json(result);
    });
});
  // Get user details
app.get("/user/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT address, pincode, state FROM users WHERE id = ?", [id], (err, results) => {
      if (err) return res.status(500).json({ error: "Failed to fetch user" });
      if (results.length === 0) return res.status(404).json({ error: "User not found" });
      res.json(results[0]);
    });
});
  app.put("/user/:id/address", (req, res) => {
    const { id } = req.params;
    const { address, pincode, state } = req.body;
    db.query(
      "UPDATE users SET address = ?, pincode = ?, state = ? WHERE id = ?",
      [address, pincode, state, id],
      (err) => {
        if (err) return res.status(500).json({ error: "Failed to update address" });
        res.json({ message: "Address updated successfully" });
      }
    );
});