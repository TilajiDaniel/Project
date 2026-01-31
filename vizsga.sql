-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 14. 08:54
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `vizsga`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `food_categories`
--

CREATE TABLE `food_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(64) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `food_categories`
--

INSERT INTO `food_categories` (`category_id`, `category_name`, `description`) VALUES
(1, 'Soup', ''),
(2, 'PreparedMeal', ''),
(3, 'FastFood', ''),
(4, 'Bakery', ''),
(5, 'Meat', ''),
(6, 'Vegetable', ''),
(7, 'Fruit', ''),
(8, 'Dairy', ''),
(9, 'Drink', ''),
(10, 'Snack', ''),
(11, 'Sweets', '');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `food_items`
--

CREATE TABLE `food_items` (
  `food_id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `category_id` int(11) NOT NULL,
  `calories_per_100g` int(11) NOT NULL CHECK (`calories_per_100g` >= 0),
  `protein_per_100g` decimal(5,2) NOT NULL,
  `carbs_per_100g` decimal(5,2) NOT NULL,
  `fat_per_100g` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `food_items`
--

INSERT INTO `food_items` (`food_id`, `name`, `category_id`, `calories_per_100g`, `protein_per_100g`, `carbs_per_100g`, `fat_per_100g`) VALUES
(1, 'Chicken soup', 1, 35, 3.00, 2.00, 1.00),
(2, 'Vegetable soup', 1, 25, 1.50, 3.50, 0.50),
(3, 'Tomato soup', 1, 40, 1.80, 6.00, 0.60),
(4, 'Goulash soup', 1, 65, 4.50, 4.00, 3.20),
(5, 'Spaghetti Bolognese', 2, 158, 7.50, 18.00, 6.50),
(6, 'Chicken stew', 2, 145, 12.00, 3.00, 7.50),
(7, 'Beef stew', 2, 170, 14.00, 2.50, 9.00),
(8, 'Lasagna', 2, 165, 8.00, 14.00, 8.50),
(9, 'Fried rice', 2, 180, 4.00, 26.00, 6.00),
(10, 'Cheeseburger', 3, 295, 17.00, 30.00, 13.00),
(11, 'Hamburger', 3, 250, 15.00, 28.00, 10.00),
(12, 'French fries', 3, 312, 3.40, 41.00, 15.00),
(13, 'Hot dog', 3, 290, 10.00, 23.00, 18.00),
(14, 'White bread', 4, 265, 9.00, 49.00, 3.20),
(15, 'Whole wheat bread', 4, 247, 13.00, 41.00, 4.20),
(16, 'Croissant', 4, 406, 8.00, 45.00, 21.00),
(17, 'Baguette', 4, 270, 8.80, 56.00, 1.00),
(18, 'Chicken breast', 5, 165, 31.00, 0.00, 3.60),
(19, 'Pork loin', 5, 195, 27.00, 0.00, 9.00),
(20, 'Beef steak', 5, 250, 26.00, 0.00, 17.00),
(21, 'Turkey breast', 5, 135, 30.00, 0.00, 1.50),
(22, 'Carrot', 6, 41, 0.90, 9.60, 0.20),
(23, 'Broccoli', 6, 34, 2.80, 6.60, 0.40),
(24, 'Tomato', 6, 18, 0.90, 3.90, 0.20),
(25, 'Cucumber', 6, 15, 0.70, 3.60, 0.10),
(26, 'Apple', 7, 52, 0.30, 14.00, 0.20),
(27, 'Banana', 7, 89, 1.10, 23.00, 0.30),
(28, 'Orange', 7, 47, 0.90, 12.00, 0.10),
(29, 'Strawberry', 7, 32, 0.70, 7.70, 0.30),
(30, 'Milk 2.8%', 8, 50, 3.40, 4.80, 2.80),
(31, 'Natural yogurt', 8, 59, 10.00, 3.60, 0.40),
(32, 'Gouda cheese', 8, 356, 25.00, 2.20, 27.00),
(33, 'Cottage cheese', 8, 98, 11.00, 3.40, 4.30),
(34, 'Water', 9, 0, 0.00, 0.00, 0.00),
(35, 'Orange juice', 9, 45, 0.70, 10.40, 0.20),
(36, 'Cola', 9, 42, 0.00, 10.60, 0.00),
(37, 'Energy drink (sugar free)', 9, 3, 0.00, 0.20, 0.00),
(38, 'Potato chips', 10, 536, 7.00, 53.00, 35.00),
(39, 'Popcorn', 10, 387, 12.00, 78.00, 5.00),
(40, 'Salted peanuts', 10, 567, 26.00, 16.00, 49.00),
(41, 'Milk chocolate', 11, 535, 7.60, 59.00, 30.00),
(42, 'Dark chocolate', 11, 546, 4.90, 46.00, 31.00),
(43, 'Vanilla ice cream', 11, 207, 3.50, 24.00, 11.00),
(44, 'Pancake', 11, 227, 6.00, 28.00, 9.00),
(45, 'Scrambled eggs', 2, 148, 10.00, 2.00, 11.00),
(46, 'Boiled egg', 5, 155, 13.00, 1.10, 11.00),
(47, 'Cooked rice', 2, 130, 2.70, 28.00, 0.30),
(48, 'Cooked pasta', 2, 131, 5.00, 25.00, 1.10),
(49, 'Oatmeal', 4, 389, 16.90, 66.30, 6.90),
(50, 'Protein bar', 10, 350, 25.00, 30.00, 10.00);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `meals`
--

CREATE TABLE `meals` (
  `meal_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `meal_date` date NOT NULL,
  `meal_type` enum('Breakfast','Lunch','Dinner','Supper','Snack') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `meals`
--

INSERT INTO `meals` (`meal_id`, `user_id`, `meal_date`, `meal_type`, `created_at`) VALUES
(1, 1, '2026-01-14', 'Breakfast', '2026-01-14 07:45:16'),
(2, 1, '2026-01-14', 'Lunch', '2026-01-14 07:45:16'),
(3, 2, '2026-01-14', 'Breakfast', '2026-01-14 07:45:16'),
(4, 2, '2026-01-14', 'Dinner', '2026-01-14 07:45:16');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `meal_food_items`
--

CREATE TABLE `meal_food_items` (
  `meal_id` int(11) NOT NULL,
  `food_id` int(11) NOT NULL,
  `quantity_grams` int(11) DEFAULT NULL,
  `added_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `meal_food_items`
--

INSERT INTO `meal_food_items` (`meal_id`, `food_id`, `quantity_grams`, `added_at`) VALUES
(1, 26, 150, '2026-01-14 08:51:36'),
(1, 30, 250, '2026-01-14 08:51:36'),
(1, 49, 60, '2026-01-14 08:51:36'),
(2, 5, 350, '2026-01-14 08:51:36'),
(2, 23, 100, '2026-01-14 08:51:36'),
(3, 27, 120, '2026-01-14 08:51:36'),
(3, 31, 200, '2026-01-14 08:51:36'),
(4, 8, 300, '2026-01-14 08:51:36'),
(4, 22, 80, '2026-01-14 08:51:36');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(128) NOT NULL,
  `height_cm` int(11) DEFAULT NULL CHECK (`height_cm` > 0),
  `weight_kg` decimal(5,2) DEFAULT NULL CHECK (`weight_kg` > 0),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `email`, `height_cm`, `weight_kg`, `created_at`) VALUES
(1, 'testuser1', '$2a$11$dummyhashuser1', 'testuser1@email.com', 178, 92.00, '2026-01-14 07:42:57'),
(2, 'testuser2', '$2a$11$dummyhashuser2', 'testuser2@email.com', 165, 75.00, '2026-01-14 07:42:57');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_settings`
--

CREATE TABLE `user_settings` (
  `user_id` int(11) NOT NULL,
  `daily_calorie_goal` int(11) DEFAULT 2000 CHECK (`daily_calorie_goal` > 0),
  `daily_water_goal_ml` int(11) DEFAULT 2500 CHECK (`daily_water_goal_ml` > 0),
  `preferred_timezone` varchar(32) DEFAULT 'UTC',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `user_settings`
--

INSERT INTO `user_settings` (`user_id`, `daily_calorie_goal`, `daily_water_goal_ml`, `preferred_timezone`, `updated_at`) VALUES
(1, 2200, 2500, 'Europe/Budapest', '2026-01-14 07:43:10'),
(2, 1800, 2200, 'Europe/Budapest', '2026-01-14 07:43:10');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `water_intake_log`
--

CREATE TABLE `water_intake_log` (
  `entry_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `entry_date` date NOT NULL,
  `amount_ml` int(11) NOT NULL CHECK (`amount_ml` >= 0),
  `logged_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `water_intake_log`
--

INSERT INTO `water_intake_log` (`entry_id`, `user_id`, `entry_date`, `amount_ml`, `logged_at`) VALUES
(1, 1, '2026-01-14', 500, '2026-01-14 07:44:39'),
(2, 1, '2026-01-14', 750, '2026-01-14 07:44:39'),
(3, 2, '2026-01-14', 600, '2026-01-14 07:44:39'),
(4, 2, '2026-01-14', 400, '2026-01-14 07:44:39');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `weight_goals`
--

CREATE TABLE `weight_goals` (
  `goal_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `target_weight` decimal(5,2) NOT NULL CHECK (`target_weight` > 0),
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `weight_goals`
--

INSERT INTO `weight_goals` (`goal_id`, `user_id`, `target_weight`, `start_date`, `end_date`, `created_at`) VALUES
(1, 1, 80.00, '2026-01-01', '2026-06-01', '2026-01-14 07:52:16'),
(2, 2, 65.00, '2026-01-01', '2026-05-01', '2026-01-14 07:52:16');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `weight_log`
--

CREATE TABLE `weight_log` (
  `weight_entry_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `weight_kg` decimal(5,2) NOT NULL CHECK (`weight_kg` > 0),
  `measurement_date` date NOT NULL,
  `measured_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `weight_log`
--

INSERT INTO `weight_log` (`weight_entry_id`, `user_id`, `weight_kg`, `measurement_date`, `measured_at`) VALUES
(1, 1, 92.00, '2026-01-01', '2026-01-14 07:43:28'),
(2, 1, 90.80, '2026-01-10', '2026-01-14 07:43:28'),
(3, 2, 75.00, '2026-01-01', '2026-01-14 07:43:28'),
(4, 2, 74.20, '2026-01-10', '2026-01-14 07:43:28');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `food_categories`
--
ALTER TABLE `food_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- A tábla indexei `food_items`
--
ALTER TABLE `food_items`
  ADD PRIMARY KEY (`food_id`),
  ADD KEY `idx_food_category` (`category_id`);

--
-- A tábla indexei `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`meal_id`),
  ADD UNIQUE KEY `unique_meal_per_day` (`user_id`,`meal_date`,`meal_type`),
  ADD KEY `idx_user_meals` (`user_id`,`meal_date`),
  ADD KEY `idx_meal_type` (`meal_type`);

--
-- A tábla indexei `meal_food_items`
--
ALTER TABLE `meal_food_items`
  ADD PRIMARY KEY (`meal_id`,`food_id`),
  ADD KEY `food_id` (`food_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`user_id`);

--
-- A tábla indexei `water_intake_log`
--
ALTER TABLE `water_intake_log`
  ADD PRIMARY KEY (`entry_id`),
  ADD KEY `idx_water_user_date` (`user_id`,`entry_date`);

--
-- A tábla indexei `weight_goals`
--
ALTER TABLE `weight_goals`
  ADD PRIMARY KEY (`goal_id`),
  ADD KEY `idx_user_goals` (`user_id`);

--
-- A tábla indexei `weight_log`
--
ALTER TABLE `weight_log`
  ADD PRIMARY KEY (`weight_entry_id`),
  ADD UNIQUE KEY `unique_weight_per_day` (`user_id`,`measurement_date`),
  ADD KEY `idx_user_weight` (`user_id`,`measurement_date`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `food_categories`
--
ALTER TABLE `food_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `food_items`
--
ALTER TABLE `food_items`
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT a táblához `meals`
--
ALTER TABLE `meals`
  MODIFY `meal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `water_intake_log`
--
ALTER TABLE `water_intake_log`
  MODIFY `entry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `weight_goals`
--
ALTER TABLE `weight_goals`
  MODIFY `goal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `weight_log`
--
ALTER TABLE `weight_log`
  MODIFY `weight_entry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `food_items`
--
ALTER TABLE `food_items`
  ADD CONSTRAINT `food_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `food_categories` (`category_id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `meals`
--
ALTER TABLE `meals`
  ADD CONSTRAINT `meals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `meal_food_items`
--
ALTER TABLE `meal_food_items`
  ADD CONSTRAINT `meal_food_items_ibfk_1` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`meal_id`),
  ADD CONSTRAINT `meal_food_items_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food_items` (`food_id`);

--
-- Megkötések a táblához `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `water_intake_log`
--
ALTER TABLE `water_intake_log`
  ADD CONSTRAINT `water_intake_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `weight_goals`
--
ALTER TABLE `weight_goals`
  ADD CONSTRAINT `weight_goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `weight_log`
--
ALTER TABLE `weight_log`
  ADD CONSTRAINT `weight_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
