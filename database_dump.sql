-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: food_delivery
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `delivery_personnel`
--

DROP TABLE IF EXISTS `delivery_personnel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_personnel` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `contact_info` varchar(100) NOT NULL,
  `available` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_personnel`
--

LOCK TABLES `delivery_personnel` WRITE;
/*!40000 ALTER TABLE `delivery_personnel` DISABLE KEYS */;
INSERT INTO `delivery_personnel` VALUES (1,'John Doe','111-222-3333',1),(2,'Jane Smith','444-555-6666',1),(3,'David Brown','777-888-9999',1),(4,'Amit Sharma','9876543210',1),(5,'Neha Verma','9123456780',1),(6,'Raj Patel','9012345678',0),(7,'Priya Singh','9988776655',1),(8,'Arjun Mehta','8899776655',0);
/*!40000 ALTER TABLE `delivery_personnel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `restaurant_id` int DEFAULT NULL,
  `dish_name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `availability` tinyint(1) DEFAULT '1',
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `chk_price_non_negative` CHECK ((`price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES (1,1,'Big Mac',5.99,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQXRnq7LzyIyeZ70VDLzZwKfsoR3-KMoKuaQ&s'),(2,1,'McChicken',4.49,1,'https://www.allrecipes.com/thmb/cEaLfplaeP_pwhDKvB_vah_Ezwg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/8702751_CopycatMcChicken4x3-fd74c35c3fdc48538f4d3e95e7fda55a.jpg'),(3,2,'Pepperoni Pizza',12.99,1,'https://cdn.uengage.io/uploads/5/image-579987-1715686804.png'),(4,2,'Cheese Pizza',10.99,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo2caybeYXSroui0tILLretGZhzZ03-Hhkzw&s'),(5,3,'Fried Chicken Bucket',15.99,1,'https://cdn4.singleinterface.com/files/banner_images/34404/952_1624955497_wednesdaybucketmin.jpg'),(6,3,'Zinger Burger',6.99,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXRFvPAdIN1bwDPNs2_ps-JIPgV5okvWym7g&s'),(7,1,'French Fries',2.99,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-S6BmCEcWmhaWNy8QeBCTttMyOaRmzd6yjw&s'),(8,2,'Garlic Bread',4.99,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Sn9WC6_F7nc3auHej98wsghnKrN4ypoqeQ&s'),(9,3,'Popcorn Chicken',4.99,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX46mZkh78GauA_maOfheHLCpR9Pi7ZgqZXA&s'),(10,4,'Pepperoni Pizza',10.99,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuAY3JVf6etk2PYpXWSQp100eiPYIog9RTIw&s'),(11,4,'BBQ Chicken Pizza',13.99,1,'https://www.licious.in/blog/wp-content/uploads/2020/12/BBQ-Chicken-Pizza.jpg'),(12,4,'Cheese pizza',5.49,1,'https://www.recipetineats.com/tachyon/2023/05/Garlic-cheese-pizza_9.jpg?resize=500%2C500'),(13,5,'Classic Cheeseburger',8.99,1,'https://s23209.pcdn.co/wp-content/uploads/2022/07/220602_DD_The-Best-Ever-Cheeseburger_267.jpg'),(14,5,'Double Patty Burger',10.49,1,'https://images.ctfassets.net/0dkgxhks0leg/2sDFsZYlCbQR7k6RrEQhCd/78f5176201067ff7fd6480adfcb80188/Double_Dilly_Smashburger_with_fries.jpg'),(15,5,'Veggie Burger',9.49,1,'https://www.vegrecipesofindia.com/wp-content/uploads/2020/12/burger-recipe-1-500x500.jpg'),(16,6,'Salmon Sushi Roll',14.99,1,'https://vaya.in/recipes/wp-content/uploads/2018/09/Smoked-Salmon-Sushi-Roll.jpg'),(17,6,'California Roll',11.99,1,'https://cdn.britannica.com/54/171754-050-8581F347/California-rolls-sushi.jpg'),(18,6,'Tuna Sashimi',16.99,1,'https://getfish.com.au/cdn/shop/articles/Step_3_-_Tuna_Sashimi.png?v=1717040042'),(19,7,'Butter Chicken',13.99,1,'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/07/chicken-butter-masala-recipe.jpg'),(20,7,'Paneer Tikka',12.49,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYAud3G3kRsjZe3N5xs6NHI4uw-wx0BqJb1Q&s'),(21,7,'Tandoori Naan',3.99,1,'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/butter-naan.jpg'),(22,8,'Vegan Buddha Bowl',9.99,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbphY3TPZ8IxE2OnVTDnFghlknVKGFKyGdmQ&s'),(23,8,'Avocado Toast',7.99,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc9AIvAc6dkD5GTVhVASi91F4Jc4n7AbOFhw&s'),(24,8,'Quinoa Salad',8.49,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjIQXCLRxkef49cD21MxIXiOu45J-wIQPKog&s'),(26,1,'Corn and Cheese Burger',4.99,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG6uKuoYsx9TFceNhNzR_ssg0zEljry9DzPQ&s'),(27,9,'Paneer Tikka sub',5.67,1,'https://www.archanaskitchen.com//images/archanaskitchen/0-Archanas-Kitchen-Recipes/2016/1-Archana/Paneer_Tikka_Sub_Sandwich_Recipe_Del_Monte_Mayo-5.jpg'),(28,9,'Chatpata chana Subwrap',4.99,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL0K6hFHFSBfGnG8ZrjaoyRHNSdcr8yZpU7w&s'),(29,9,'Veggie Delight',5.99,1,'https://feenix.co.in/wp-content/uploads/2022/07/1509095368-veggiedelite_tm__1365688768.jpg'),(30,3,'biryani',7.00,1,'');
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `restaurant_id` int DEFAULT NULL,
  `items` json NOT NULL,
  `status` enum('Pending','Preparing','On the way','Delivered') DEFAULT 'Pending',
  `delivery_person_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (15,2,1,'[\"McChicken\", \"French Fries\"]','Delivered',3),(16,3,5,'[\"Double Patty Burger\", \"Veggie Burger\"]','Delivered',1),(17,2,4,'[\"BBQ Chicken Pizza\"]','Delivered',1),(18,2,2,'[\"Cheese Pizza\", \"Garlic Bread\"]','Delivered',1),(19,2,2,'[\"Pepperoni Pizza\"]','Delivered',2),(25,3,9,'[\"Chatpata chana Subwrap\"]','Delivered',8),(26,3,8,'[\"Quinoa Salad\"]','Delivered',6),(27,3,4,'[\"BBQ Chicken Pizza\"]','Delivered',5),(28,2,2,'[\"Garlic Bread\"]','Delivered',6),(29,2,3,'[\"Zinger Burger\", \"Popcorn Chicken\"]','Delivered',2),(30,7,2,'[\"Garlic Bread\", \"Cheese Pizza\", \"Pepperoni Pizza\"]','On the way',6),(31,7,3,'[\"Zinger Burger\"]','Delivered',1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `contact_info` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `chk_restaurant_password_length` CHECK ((char_length(`password`) >= 6))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,'McDonald\'s','123 Main St, City','123-456-7890','https://retailinsider.b-cdn.net/wp-content/uploads/2022/09/16553-Ste-Julie-High-Res-Exterior-01-Print-696x457.jpeg','mcdonalds@example.com','mcd123'),(2,'Domino\'s Pizza','456 Elm St, City','987-654-3210','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRshgR09PeK5pQ3Sq0W0OwwHYtrv_QVfOLq4w&s','dominos@example.com','dom123'),(3,'KFC','789 Oak St, City','555-555-5555','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5GdnzFJ4LjFgiZvvTNUCTi81n1EoktYKrOmq4ZiESxFzMyr7Lxh9PZ_CKzoUSGIl5r-E&usqp=CAU','kfc@example.com','kfc123'),(4,'Pizza Paradise','123 Main St, New York, NY','555-1234','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcwGfpx9lUz1XG8gA1T44qufMnCfoRhe71ww&s','pizzaparadise@example.com','pizza123'),(5,'Burger Haven','456 Elm St, Los Angeles, CA','555-5678','https://content3.jdmagicbox.com/v2/comp/sirsa-haryana/x5/9999p1666.1666.240713213439.k3x5/catalogue/burger-haven-panniwala-mota-sirsa-haryana-burger-joints-dqmapndwqb.jpg','burgerhaven@example.com','burger123'),(6,'Sushi World','789 Oak St, San Francisco, CA','555-8765','https://thumbs.dreamstime.com/b/sushi-world-store-located-food-court-chatswood-westfield-centre-sydney-australia-jun-lunch-time-rush-174164648.jpg','sushiworld@example.com','sushi123'),(7,'Tandoori Treats','321 Maple St, Houston, TX','555-3456','https://media-cdn.tripadvisor.com/media/photo-s/13/10/07/1b/face-of-tandoori-treats.jpg','tandooritreats@example.com','tandoori123'),(8,'Vegan Delights','654 Pine St, Seattle, WA','555-6789','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbsJh9_W_F4gzlbE5OfRAFP4TsoxSj4WJMwQ&s','vegandelights@example.com','vegan123'),(9,'Subway','567 Elm St,NY','539-383-2392','https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/2025-01/subway_restaurant.jpeg','subway@example.com','subway123');
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `pincode` varchar(6) NOT NULL,
  `state` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `unique_email` (`email`),
  UNIQUE KEY `unique_phone` (`phone`),
  CONSTRAINT `chk_phone_length` CHECK ((char_length(`phone`) >= 10)),
  CONSTRAINT `chk_user_password_length` CHECK ((char_length(`password`) >= 6))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Ruchika Yadav','ruchika.yadav1285@gmail.com','07987955683','abcdef','K-15,Silicon City,Indore','452012','Madhya┬áPradesh'),(3,'Kailash Yadav','kailash@gmail.com','8889915281','fghijk','Radharani appartment silicon city Indore Madhya Pradesh','453331','Madhya Pradesh'),(4,'Riya Verma','riyaverma@gmail.com','7938472898','riya123','H-14,Vinodini Hostel,MNIT','302017','Jaipur'),(5,'arya varshney','arya@gmail.com','9792378372','123abc','vinodini hostel','302017','Jaipur'),(6,'Pooja','pooja@gmail.com','8363728178','pooja123','home','301001','Sikkim'),(7,'mahesh kumar','mahesh@gmail.com','1234567890','mahesh123','jaipur','123456','rajasthan');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-23 16:30:44
