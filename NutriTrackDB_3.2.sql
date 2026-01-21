-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 21. 10:03
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
(50, 'Protein bar', 10, 350, 25.00, 30.00, 10.00),
(51, 'Mushroom soup', 1, 39, 1.20, 4.30, 2.50),
(52, 'Pea soup', 1, 75, 5.00, 12.00, 1.00),
(53, 'Risotto', 2, 130, 3.00, 25.00, 2.00),
(54, 'Sushi (Maki)', 2, 140, 5.00, 28.00, 1.00),
(55, 'Pizza Margherita', 3, 266, 11.00, 33.00, 10.00),
(56, 'Gyros in pita', 3, 260, 12.00, 30.00, 10.00),
(57, 'Chicken Nuggets', 3, 296, 15.00, 20.00, 18.00),
(58, 'Rye bread', 4, 259, 8.50, 48.00, 3.30),
(59, 'Toast bread', 4, 260, 8.00, 49.00, 3.00),
(60, 'Tortilla wrap', 4, 299, 8.00, 53.00, 8.00),
(61, 'Bagel', 4, 250, 10.00, 49.00, 1.50),
(62, 'Grilled Salmon', 5, 206, 22.00, 0.00, 12.00),
(63, 'Tuna (canned in water)', 5, 116, 26.00, 0.00, 1.00),
(64, 'Cod fillet', 5, 82, 18.00, 0.00, 1.00),
(65, 'Pork chop', 5, 242, 27.00, 0.00, 14.00),
(66, 'Ham', 5, 145, 21.00, 1.50, 6.00),
(67, 'Bacon', 5, 541, 37.00, 1.40, 42.00),
(68, 'Salami', 5, 336, 22.00, 2.40, 26.00),
(69, 'Spinach', 6, 23, 2.90, 3.60, 0.40),
(70, 'Bell Pepper (Red)', 6, 31, 1.00, 6.00, 0.30),
(71, 'Onion', 6, 40, 1.10, 9.30, 0.10),
(72, 'Potato (raw)', 6, 77, 2.00, 17.00, 0.10),
(73, 'Sweet Potato', 6, 86, 1.60, 20.00, 0.10),
(74, 'Corn (sweet)', 6, 86, 3.20, 19.00, 1.20),
(75, 'Green Peas', 6, 81, 5.00, 14.00, 0.40),
(76, 'Cauliflower', 6, 25, 1.90, 5.00, 0.30),
(77, 'Lettuce', 6, 14, 0.90, 3.00, 0.10),
(78, 'Mushrooms', 6, 22, 3.10, 3.30, 0.30),
(79, 'Zucchini', 6, 17, 1.20, 3.10, 0.30),
(80, 'Pear', 7, 57, 0.40, 15.00, 0.10),
(81, 'Grapes', 7, 69, 0.70, 18.00, 0.20),
(82, 'Peach', 7, 39, 0.90, 9.50, 0.30),
(83, 'Watermelon', 7, 30, 0.60, 7.60, 0.20),
(84, 'Pineapple', 7, 50, 0.50, 13.00, 0.10),
(85, 'Kiwi', 7, 61, 1.10, 15.00, 0.50),
(86, 'Blueberries', 7, 57, 0.70, 14.00, 0.30),
(87, 'Cherries', 7, 50, 1.00, 12.00, 0.30),
(88, 'Mozzarella', 8, 280, 28.00, 3.10, 17.00),
(89, 'Cheddar cheese', 8, 403, 25.00, 1.30, 33.00),
(90, 'Parmesan', 8, 431, 38.00, 4.10, 29.00),
(91, 'Butter', 8, 717, 0.90, 0.10, 81.00),
(92, 'Sour cream', 8, 214, 3.00, 4.00, 20.00),
(93, 'Apple juice', 9, 46, 0.10, 11.00, 0.10),
(94, 'Coffee (black)', 9, 1, 0.10, 0.00, 0.00),
(95, 'Almonds', 10, 579, 21.00, 22.00, 50.00),
(96, 'Walnuts', 10, 654, 15.00, 14.00, 65.00),
(97, 'Cashews', 10, 553, 18.00, 30.00, 44.00),
(98, 'Pumpkin seeds', 10, 559, 30.00, 10.70, 49.00),
(99, 'Rice cakes', 10, 387, 8.00, 82.00, 2.80),
(100, 'Honey', 11, 304, 0.30, 82.00, 0.00),
(101, 'Strawberry Jam', 11, 278, 0.40, 69.00, 0.10),
(102, 'Chocolate Chip Cookie', 11, 488, 5.00, 64.00, 24.00),
(103, 'Minestrone soup', 1, 36, 1.80, 5.50, 0.80),
(104, 'Lentil soup', 1, 56, 3.50, 8.00, 1.20),
(105, 'Pumpkin cream soup', 1, 45, 1.00, 6.50, 2.00),
(106, 'French onion soup', 1, 48, 1.50, 5.00, 2.50),
(107, 'Ramen soup', 1, 80, 4.00, 10.00, 2.50),
(108, 'Pho soup', 1, 70, 5.00, 10.00, 1.50),
(109, 'Fish soup', 1, 55, 6.00, 1.50, 2.80),
(110, 'Chili con carne', 2, 105, 7.50, 9.00, 4.50),
(111, 'Chicken Curry', 2, 110, 8.00, 6.00, 6.00),
(112, 'Pad Thai', 2, 155, 6.00, 22.00, 5.00),
(113, 'Beef Stroganoff', 2, 160, 10.00, 4.00, 11.00),
(114, 'Mac and Cheese', 2, 164, 7.00, 18.00, 7.00),
(115, 'Paella', 2, 145, 6.50, 20.00, 4.50),
(116, 'Burrito', 2, 180, 8.00, 25.00, 6.00),
(117, 'Falafel plate', 2, 190, 6.00, 22.00, 9.00),
(118, 'Ratatouille', 2, 65, 1.50, 6.00, 4.00),
(119, 'Moussaka', 2, 120, 5.00, 8.00, 7.50),
(120, 'Onion rings', 3, 280, 3.00, 35.00, 15.00),
(121, 'Fried chicken wings', 3, 290, 18.00, 10.00, 20.00),
(122, 'Taco', 3, 210, 9.00, 20.00, 10.00),
(123, 'Quesadilla', 3, 250, 12.00, 22.00, 13.00),
(124, 'Fish and Chips', 3, 230, 9.00, 25.00, 11.00),
(125, 'Pita bread', 4, 275, 9.00, 56.00, 1.20),
(126, 'Ciabatta', 4, 260, 8.50, 48.00, 3.50),
(127, 'Naan bread', 4, 310, 9.50, 50.00, 6.00),
(128, 'Focaccia', 4, 250, 8.00, 35.00, 8.50),
(129, 'Brioche', 4, 340, 9.00, 48.00, 13.00),
(130, 'English Muffin', 4, 235, 8.00, 44.00, 1.00),
(131, 'Scone', 4, 350, 6.00, 50.00, 14.00),
(132, 'Breadsticks', 4, 400, 10.00, 70.00, 9.00),
(133, 'Duck breast', 5, 201, 19.00, 0.00, 14.00),
(134, 'Lamb chop', 5, 294, 25.00, 0.00, 21.00),
(135, 'Veal cutlet', 5, 172, 24.00, 0.00, 8.00),
(136, 'Turkey leg', 5, 144, 20.00, 0.00, 7.00),
(137, 'Rabbit meat', 5, 173, 33.00, 0.00, 3.50),
(138, 'Goose meat', 5, 305, 16.00, 0.00, 27.00),
(139, 'Shrimp', 5, 99, 24.00, 0.20, 0.30),
(140, 'Mussels', 5, 86, 12.00, 3.70, 2.20),
(141, 'Squid', 5, 92, 15.60, 3.10, 1.40),
(142, 'Trout', 5, 148, 20.80, 0.00, 6.60),
(143, 'Mackerel', 5, 205, 18.60, 0.00, 13.90),
(144, 'Sardines (canned)', 5, 208, 24.60, 0.00, 11.50),
(145, 'Asparagus', 6, 20, 2.20, 3.90, 0.10),
(146, 'Eggplant', 6, 25, 1.00, 6.00, 0.20),
(147, 'Brussels sprouts', 6, 43, 3.40, 9.00, 0.30),
(148, 'Cabbage (white)', 6, 25, 1.30, 5.80, 0.10),
(149, 'Kale', 6, 49, 4.30, 8.80, 0.90),
(150, 'Celery', 6, 16, 0.70, 3.00, 0.20),
(151, 'Beetroot', 6, 43, 1.60, 9.60, 0.20),
(152, 'Radish', 6, 16, 0.70, 3.40, 0.10),
(153, 'Leek', 6, 61, 1.50, 14.00, 0.30),
(154, 'Green beans', 6, 31, 1.80, 7.00, 0.20),
(155, 'Artichoke', 6, 47, 3.30, 10.50, 0.20),
(156, 'Ginger', 6, 80, 1.80, 17.80, 0.80),
(157, 'Garlic', 6, 149, 6.40, 33.00, 0.50),
(158, 'Kohlrabi', 6, 27, 1.70, 6.20, 0.10),
(159, 'Chard', 6, 19, 1.80, 3.70, 0.20),
(160, 'Grapefruit', 7, 42, 0.80, 11.00, 0.10),
(161, 'Lemon', 7, 29, 1.10, 9.00, 0.30),
(162, 'Lime', 7, 30, 0.70, 10.00, 0.20),
(163, 'Mango', 7, 60, 0.80, 15.00, 0.40),
(164, 'Papaya', 7, 43, 0.50, 11.00, 0.30),
(165, 'Plum', 7, 46, 0.70, 11.00, 0.30),
(166, 'Apricot', 7, 48, 1.40, 11.00, 0.40),
(167, 'Raspberries', 7, 52, 1.20, 12.00, 0.70),
(168, 'Blackberries', 7, 43, 1.40, 9.60, 0.50),
(169, 'Cranberries', 7, 46, 0.40, 12.00, 0.10),
(170, 'Figs', 7, 74, 0.80, 19.00, 0.30),
(171, 'Dates', 7, 282, 2.50, 75.00, 0.40),
(172, 'Coconut meat', 7, 354, 3.30, 15.00, 33.00),
(173, 'Cantaloupe melon', 7, 34, 0.80, 8.00, 0.20),
(174, 'Pomegranate', 7, 83, 1.70, 19.00, 1.20),
(175, 'Kefir', 8, 41, 3.40, 4.00, 1.00),
(176, 'Feta cheese', 8, 264, 14.00, 4.00, 21.00),
(177, 'Brie cheese', 8, 334, 20.00, 0.50, 27.00),
(178, 'Camembert', 8, 300, 19.80, 0.50, 24.00),
(179, 'Ricotta', 8, 174, 11.00, 3.00, 13.00),
(180, 'Mascarpone', 8, 455, 3.60, 2.00, 47.00),
(181, 'Blue cheese', 8, 353, 21.00, 2.00, 29.00),
(182, 'Goat cheese', 8, 364, 22.00, 0.10, 30.00),
(183, 'Green Tea', 9, 1, 0.00, 0.00, 0.00),
(184, 'Black Tea', 9, 1, 0.00, 0.00, 0.00),
(185, 'Beer (Lager)', 9, 43, 0.50, 3.60, 0.00),
(186, 'Red Wine', 9, 85, 0.10, 2.60, 0.00),
(187, 'White Wine', 9, 82, 0.10, 2.60, 0.00),
(188, 'Lemonade', 9, 40, 0.00, 10.00, 0.00),
(189, 'Tomato juice', 9, 17, 0.80, 4.00, 0.10),
(190, 'Iced Tea', 9, 35, 0.00, 9.00, 0.00),
(191, 'Pistachios', 10, 560, 20.00, 27.00, 45.00),
(192, 'Hazelnuts', 10, 628, 15.00, 17.00, 61.00),
(193, 'Sunflower seeds', 10, 584, 21.00, 20.00, 51.00),
(194, 'Brazil nuts', 10, 656, 14.00, 12.00, 66.00),
(195, 'Macadamia nuts', 10, 718, 8.00, 14.00, 76.00),
(196, 'Olives (green)', 10, 145, 1.00, 3.80, 15.00),
(197, 'Olives (black)', 10, 115, 0.80, 6.00, 11.00),
(198, 'Donut', 11, 452, 4.90, 51.00, 25.00),
(199, 'Cheesecake', 11, 321, 5.50, 25.00, 22.00),
(200, 'Brownie', 11, 466, 6.40, 50.00, 29.00),
(201, 'Chocolate Muffin', 11, 377, 4.50, 54.00, 16.00),
(202, 'Gummi bears', 11, 343, 6.90, 77.00, 0.10),
(203, 'Marshmallow', 11, 318, 1.80, 81.00, 0.20),
(204, 'Maple syrup', 11, 260, 0.00, 67.00, 0.10),
(205, 'Vanilla Pudding', 11, 120, 3.00, 22.00, 2.00),
(206, 'Fishermans Soup (Halaszle)', 1, 75, 12.00, 1.50, 3.50),
(207, 'Jokai Bean Soup', 1, 110, 7.00, 9.00, 6.00),
(208, 'Cold Sour Cherry Soup', 1, 85, 2.00, 18.00, 1.50),
(209, 'Chicken Paprikash', 2, 160, 14.00, 5.00, 10.00),
(210, 'Beef Porkolt (Stew)', 2, 180, 18.00, 3.00, 11.00),
(211, 'Stuffed Cabbage', 2, 130, 7.00, 12.00, 7.00),
(212, 'Cottage Cheese Noodles', 2, 220, 10.00, 25.00, 10.00),
(213, 'Hortobagyi Pancake (Meat)', 2, 195, 12.00, 18.00, 9.00),
(214, 'Hungarian Lecso', 2, 95, 3.00, 8.00, 6.00),
(215, 'Potato Casserole (Rakott krumpli)', 2, 170, 8.00, 16.00, 10.00),
(216, 'Paprika Potato Stew', 2, 140, 4.00, 18.00, 7.00),
(217, 'Szekely Cabbage', 2, 165, 8.50, 5.00, 12.00),
(218, 'Langos', 3, 280, 8.00, 35.00, 14.00),
(219, 'Pogacsa (Cheese scone)', 4, 350, 12.00, 35.00, 18.00),
(220, 'Kifli (Crescent roll)', 4, 285, 8.50, 56.00, 3.00),
(221, 'Winter Salami (Teliszalami)', 5, 510, 24.00, 1.00, 44.00),
(222, 'Hurka (Blood sausage)', 5, 300, 12.00, 2.00, 28.00),
(223, 'Korozott (Spiced curd)', 8, 180, 15.00, 4.00, 12.00),
(224, 'Chimney Cake (Kurtoskalacs)', 11, 320, 8.00, 55.00, 8.00),
(225, 'Dobos Cake', 11, 400, 6.00, 45.00, 22.00),
(226, 'Somloi Galuska', 11, 310, 6.00, 38.00, 15.00),
(227, 'Gundel Pancake', 11, 330, 7.00, 40.00, 16.00),
(228, 'Poppy Seed Roll (Bejgli)', 11, 360, 9.00, 45.00, 18.00),
(229, 'Turo Rudi', 11, 360, 10.00, 38.00, 19.00),
(230, 'Floating Island (Madartej)', 11, 160, 8.00, 20.00, 5.00),
(231, 'Big Mac (McDonalds)', 3, 257, 11.80, 20.00, 15.00),
(232, 'Cheeseburger (McDonalds)', 3, 263, 13.00, 30.00, 10.00),
(233, 'Double Cheeseburger (McDonalds)', 3, 265, 15.00, 19.00, 14.00),
(234, 'McChicken (McDonalds)', 3, 242, 10.00, 25.00, 11.00),
(235, 'McRoyal (McDonalds)', 3, 245, 14.00, 18.00, 13.00),
(236, 'Filet-o-Fish (McDonalds)', 3, 270, 11.00, 24.00, 14.00),
(237, 'Chicken McNuggets (McDonalds)', 3, 250, 15.00, 18.00, 13.00),
(238, 'Spicy McChicken (McDonalds)', 3, 255, 10.50, 26.00, 12.00),
(239, 'French Fries (McDonalds)', 3, 289, 3.40, 36.00, 14.00),
(240, 'McFlurry Oreo (McDonalds)', 11, 175, 3.50, 26.00, 6.00),
(241, 'McFlurry M&Ms (McDonalds)', 11, 180, 3.20, 28.00, 6.50),
(242, 'Apple Pie (McDonalds)', 11, 250, 2.50, 32.00, 12.00),
(243, 'Vanilla Shake (McDonalds)', 11, 105, 3.00, 18.00, 2.50),
(244, 'Hot Wings (KFC)', 3, 325, 18.50, 14.00, 21.00),
(245, 'Original Recipe Drumstick (KFC)', 3, 235, 23.00, 6.50, 13.50),
(246, 'Crispy Strips (KFC)', 3, 275, 21.00, 16.00, 14.00),
(247, 'Popcorn Chicken (KFC)', 3, 305, 15.00, 21.00, 18.00),
(248, 'Zinger Burger (KFC)', 3, 260, 13.00, 24.00, 12.00),
(249, 'Twister Wrap (KFC)', 3, 225, 11.00, 23.00, 10.00),
(250, 'Boxmaster (KFC)', 3, 245, 12.00, 21.00, 13.00),
(251, 'Grander Burger (KFC)', 3, 255, 14.00, 19.00, 15.00),
(252, 'French Fries (KFC)', 3, 295, 3.50, 37.00, 14.50),
(253, 'Coleslaw (KFC)', 3, 145, 1.00, 11.00, 10.00),
(254, 'Milbona High Protein Pudding', 8, 76, 10.00, 5.50, 1.50),
(255, 'Milbona High Protein Yogurt', 8, 60, 10.00, 4.00, 0.20),
(256, 'Milbona High Protein Cottage Cheese', 8, 67, 12.20, 3.50, 0.30),
(257, 'Milbona Skyr', 8, 65, 11.00, 4.00, 0.20),
(258, 'Milbona High Protein Drink', 8, 57, 10.00, 4.10, 0.10),
(259, 'Milbona Quark (Low fat curd)', 8, 68, 12.00, 3.90, 0.30),
(260, 'Protein Bar (Average)', 10, 350, 35.00, 30.00, 12.00),
(261, 'Protein Shake (mixed with water)', 8, 35, 7.50, 0.50, 0.50),
(262, 'Protein Shake (with 1.5% milk)', 8, 85, 11.50, 4.90, 2.00),
(263, 'Protein Shake (with 2.8% milk)', 8, 94, 11.50, 4.90, 3.20),
(264, 'Protein Shake (with plant milk/almond)', 8, 45, 9.00, 1.50, 1.50);

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
-- Tábla szerkezet ehhez a táblához `privilege`
--

CREATE TABLE `privilege` (
  `Id` int(11) NOT NULL,
  `Privilege` varchar(16) DEFAULT NULL,
  `Level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `privilege`
--

INSERT INTO `privilege` (`Id`, `Privilege`, `Level`) VALUES
(1, 'Not confirmed', 1),
(2, 'Basic', 2),
(3, 'Admin', 4),
(4, 'Test user', 3);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `privilege` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `email`, `height_cm`, `weight_kg`, `created_at`, `privilege`) VALUES
(1, 'testuser1', '$2a$11$dummyhashuser1', 'testuser1@email.com', 178, 92.00, '2026-01-14 07:42:57', 3),
(2, 'testuser2', '$2a$11$dummyhashuser2', 'testuser2@email.com', 165, 75.00, '2026-01-14 07:42:57', 3);

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
-- A tábla indexei `privilege`
--
ALTER TABLE `privilege`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Level` (`Level`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_privilege_level` (`privilege`);

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
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=265;

--
-- AUTO_INCREMENT a táblához `meals`
--
ALTER TABLE `meals`
  MODIFY `meal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `privilege`
--
ALTER TABLE `privilege`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
-- Megkötések a táblához `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_privilege_level` FOREIGN KEY (`privilege`) REFERENCES `privilege` (`level`);

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
