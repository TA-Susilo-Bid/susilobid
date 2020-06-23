-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: susilobid
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bid`
--

DROP TABLE IF EXISTS `bid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bid` (
  `bid_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `bidder_id` int NOT NULL,
  `offer` int NOT NULL,
  `count` int NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`bid_id`),
  KEY `fk_product_id_idx` (`product_id`),
  KEY `fk_bidder_id_idx` (`bidder_id`),
  CONSTRAINT `fk_bidder_id` FOREIGN KEY (`bidder_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bid`
--

LOCK TABLES `bid` WRITE;
/*!40000 ALTER TABLE `bid` DISABLE KEYS */;
INSERT INTO `bid` VALUES (107,16,33,6000000,1,'2020-06-24 03:04:11'),(108,16,44,7000000,1,'2020-06-24 03:06:03'),(109,16,33,8000000,2,'2020-06-24 03:06:31'),(110,16,2,9000000,1,'2020-06-24 03:10:26');
/*!40000 ALTER TABLE `bid` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bid_result`
--

DROP TABLE IF EXISTS `bid_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bid_result` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bid_id` int NOT NULL,
  `total_count_bidding` int NOT NULL,
  `highest_bid` int NOT NULL,
  `winner_id` int NOT NULL,
  `seller_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bid_id_idx` (`bid_id`),
  CONSTRAINT `fk_bid_id` FOREIGN KEY (`bid_id`) REFERENCES `bid` (`bid_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bid_result`
--

LOCK TABLES `bid_result` WRITE;
/*!40000 ALTER TABLE `bid_result` DISABLE KEYS */;
/*!40000 ALTER TABLE `bid_result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bid_status`
--

DROP TABLE IF EXISTS `bid_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bid_status` (
  `status_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bid_status`
--

LOCK TABLES `bid_status` WRITE;
/*!40000 ALTER TABLE `bid_status` DISABLE KEYS */;
INSERT INTO `bid_status` VALUES (1,'On Going'),(2,'Close');
/*!40000 ALTER TABLE `bid_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `bid_result_id` int NOT NULL,
  `amount` int NOT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `fk_user_id_idx` (`user_id`),
  KEY `fk_bid_result_id_idx` (`bid_result_id`),
  CONSTRAINT `fk_bid_result_id` FOREIGN KEY (`bid_result_id`) REFERENCES `bid_result` (`id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Electronic'),(2,'Property'),(3,'Otomotif');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(100) NOT NULL,
  `invoice_total` int NOT NULL,
  `invoice_date` datetime NOT NULL,
  `trx_id` int NOT NULL,
  `invoice_pdf` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_trx_id_idx` (`trx_id`),
  CONSTRAINT `fk_trx_id` FOREIGN KEY (`trx_id`) REFERENCES `transaction` (`trx_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `seller_id` int NOT NULL,
  `product_category` int NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `product_desc` varchar(1000) NOT NULL,
  `starting_price` int NOT NULL,
  `submission_time` datetime NOT NULL,
  `due_date` datetime NOT NULL,
  `status` varchar(45) NOT NULL DEFAULT 'Pending',
  `notes` varchar(100) DEFAULT '-',
  `image_path` varchar(500) NOT NULL,
  `bid_status` int DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `fk_seller_id_idx` (`seller_id`),
  KEY `fk_product_category_idx` (`product_category`),
  KEY `fk_bid_status_idx` (`bid_status`),
  CONSTRAINT `fk_bid_status` FOREIGN KEY (`bid_status`) REFERENCES `bid_status` (`status_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`product_category`) REFERENCES `category` (`id`),
  CONSTRAINT `fk_seller_id` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (16,34,1,'Gitar Elektrik','Gitar Elektrik PRGR M-40 kondisi baru',5000000,'2020-06-24 01:13:26','2020-07-25 23:00:00','Confirm','-','/product/PRD1592936006259.jpg',1),(17,34,3,'Mobil Toyota','1 Unit Roda 4 Merk Toyota Standar/Pick-Up,KB 8320 P,Th.2005,NoKa:MHF31KF6050044483,Nosin:7K-0809963,hanya BPKB.Rusak',24929000,'2020-06-24 01:58:33','2020-08-28 09:00:00','Pending','-','/product/PRD1592938713805.jpg',NULL),(18,34,2,'Tanah','Sebidang tanah seluas 456 m2 berikut bangunan toko diatasnya, di Desa Seuneubok Benteng Kecamatan Banda Alam',400000000,'2020-06-24 02:11:06','2020-06-24 02:14:00','Confirm','-','/product/PRD1592939466225.png',2);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(45) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin'),(2,'Buyer'),(3,'Seller');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `trx_id` int NOT NULL AUTO_INCREMENT,
  `buyer_id` int NOT NULL,
  `seller_id` int DEFAULT NULL,
  `date_of_trx` datetime NOT NULL,
  `payment_to_seller` int DEFAULT NULL,
  `payment_to_admin` int DEFAULT NULL,
  `bid_result_id` int DEFAULT NULL,
  `slip_image` varchar(200) DEFAULT NULL,
  `status_trx` varchar(45) NOT NULL,
  `notes` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`trx_id`),
  KEY `fk_buyer_idx` (`buyer_id`),
  KEY `fk_seller_idx` (`seller_id`),
  CONSTRAINT `fk_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (64,2,NULL,'2020-06-24 03:09:22',NULL,20000000,NULL,'/slip/PYM1592942962350.jpg','Confirm',NULL);
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `verification_id` tinyint(1) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `phone` int DEFAULT NULL,
  `wallet` int NOT NULL DEFAULT '0',
  `status` varchar(45) NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_role_id_idx` (`role_id`),
  KEY `fk_verification_id_idx` (`verification_id`),
  CONSTRAINT `fk_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  CONSTRAINT `fk_verification_id` FOREIGN KEY (`verification_id`) REFERENCES `verification` (`verification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,1,'admin','arioamri@gmail.com','admin123',NULL,NULL,0,'Active'),(2,2,1,'arioamri','arioamri@yahoo.co.id','ca2c8a0b0baccd44a7078af6ef2fe3aa24a2a3e8769031957832149bee3c522c','Banjar Wijaya',55751409,17000000,'Banned'),(3,2,0,'buyer1','buyr@yahoo.com','tes','tes',45445,0,'Banned'),(4,2,0,'buyer2','buyer2@gmail.com','tes','asasa',454454,0,'Banned'),(32,3,0,'seller1','seller@hotmail.com','tes','ffggf',4334,217562000,'Active'),(33,2,0,'buyer3','buyer3@yahoo.com','tes','ddggg',34343,22000000,'Active'),(34,3,0,'seller2','seller2i@yahoo.co.id','tes','ssdrerer',343567676,0,'Active'),(35,2,0,'buyer4','buyer4@hotmail.com','tes','vbfdgdgf',983232,20000,'Active'),(36,2,0,'buyer5','buyer5@yahoo.com','tes','dfdfdd',434554,0,'Banned'),(37,3,0,'seller3','seller3@yahoo.com','tes','fgfgfg',323,0,'Active'),(38,3,0,'seller4','seller4@gmail.com','tes','dfdfw',466565,0,'Banned'),(39,2,0,'buyer6','buyer6@hotmail.com','tes','ffdssdss',6657567,0,'Active'),(40,2,0,'buyer7','buyer7@gmail.com','tes','gffgffg',656656,0,'Active'),(41,3,0,'seller5','seller5@yahoo.com','tes','fdfdfd',671234,0,'Banned'),(42,3,0,'seller6','seller6@gmail.com','tes','dfdf',340987,0,'Active'),(43,2,0,'buyer8','buyr8@hotmail.com','tes','fdfdd',67676,0,'Banned'),(44,2,0,'buyer9','buyer9@gmail.com','tes','aaqas',7787,2500000,'Active'),(45,2,0,'buyer10','buyer10@yahoo.com','tes','dfdfddf',686868,259600000,'Active'),(46,3,0,'seller7','seller7@yahoo.co.id','tes','fggd',721233,0,'Active'),(47,2,0,'buyer11','buyer11@gmail.com','tes','dffdfd',56565,0,'Banned'),(48,2,0,'buyer12','buyer12@gmail.com','tes','aqko',126788,0,'Active'),(49,3,0,'seller8','seller8@gmail.com','tes','dfsfsaf',1211,0,'Active'),(50,3,0,'seller9','seller9@hotmail.com','tes','dsss',1221,0,'Active'),(51,2,0,'buyer13','buyer13@gmail.com','tes','dfdfdf',34343,0,'Active'),(52,2,0,'buyer14','buyer14@yahoo.com','tes','fgfgf',524242,0,'Active'),(53,2,0,'buyer15','buyer15@gmail.com','tes','dfsfsfsf',7676767,0,'Active'),(54,3,0,'seller10','seller10@yahoo.com','tes','ahjju',124222,0,'Active'),(55,2,0,'buyer16','buyer16@gmail.com','tes','dfdfdd',11332,0,'Active'),(56,2,0,'buyer17','buyer17@gmail.com','tes','fgdgdd',2323232,0,'Banned'),(57,3,0,'seller11','seller11@yahoo.com','tes','dfdfd',454545,0,'Active'),(58,3,0,'seller12','seller12@yahoo.com','tes','dffdfd',345353,0,'Banned'),(59,2,0,'buyer18','buyer18@gmail.com','tes','dfggdg',454544,0,'Active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification`
--

DROP TABLE IF EXISTS `verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification` (
  `verification_id` tinyint(1) NOT NULL AUTO_INCREMENT,
  `verification_status` varchar(45) NOT NULL,
  PRIMARY KEY (`verification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification`
--

LOCK TABLES `verification` WRITE;
/*!40000 ALTER TABLE `verification` DISABLE KEYS */;
INSERT INTO `verification` VALUES (0,'Not Verified'),(1,'Verified');
/*!40000 ALTER TABLE `verification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-24  5:47:55
