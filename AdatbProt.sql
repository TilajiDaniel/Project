-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 02. 17:04
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `oiwvgrfng`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `food_categories`
--

CREATE TABLE `food_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(64) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `food_items`
--

CREATE TABLE `food_items` (
  `food_id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `category_id` int(11) NOT NULL,
  `calories_per_100g` int(11) NOT NULL CHECK (`calories_per_100g` >= 0),
  `protein_per_100g` decimal(6,2) NOT NULL CHECK (`protein_per_100g` >= 0),
  `carbs_per_100g` decimal(6,2) NOT NULL CHECK (`carbs_per_100g` >= 0),
  `fat_per_100g` decimal(6,2) NOT NULL CHECK (`fat_per_100g` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `meals`
--

CREATE TABLE `meals` (
  `meal_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `meal_date` date NOT NULL,
  `meal_type` enum('reggeli','tízórai','ebéd','uzsonna','vacsora','snack') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `meal_food_items`
--

CREATE TABLE `meal_food_items` (
  `meal_id` int(11) NOT NULL,
  `food_id` int(11) NOT NULL,
  `quantity_grams` int(11) NOT NULL CHECK (`quantity_grams` > 0),
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ;

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
  ADD KEY `idx_food_id` (`food_id`);

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
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `food_items`
--
ALTER TABLE `food_items`
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `meals`
--
ALTER TABLE `meals`
  MODIFY `meal_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `water_intake_log`
--
ALTER TABLE `water_intake_log`
  MODIFY `entry_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `weight_goals`
--
ALTER TABLE `weight_goals`
  MODIFY `goal_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `weight_log`
--
ALTER TABLE `weight_log`
  MODIFY `weight_entry_id` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `meal_food_items_ibfk_1` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`meal_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `meal_food_items_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food_items` (`food_id`) ON UPDATE CASCADE;

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
