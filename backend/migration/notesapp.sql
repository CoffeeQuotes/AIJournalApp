-- phpMyAdmin SQL Dump
-- version 5.2.1deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 22, 2025 at 11:07 PM
-- Server version: 10.11.6-MariaDB-0+deb12u1
-- PHP Version: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `notesapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `blacklisted_tokens`
--

CREATE TABLE `blacklisted_tokens` (
  `id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `blacklisted_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blacklisted_tokens`
--

INSERT INTO `blacklisted_tokens` (`id`, `token`, `blacklisted_at`) VALUES
(1, 'eb044558a8a56127220bb2c85d8b332195e7282fece622e7b653bc8688c12756', '2025-01-20 07:22:46'),
(2, '451ea07ad2d6fbb61139caad949ad317e7dd94e3093aa9d8d8e65b3a083eb2d5', '2025-01-20 07:26:23'),
(3, '7437ebe9b485e64797ec956c2832ed695e50619a4f5ea94f17d60b6ef2d0ff9d', '2025-01-20 08:40:06');

-- --------------------------------------------------------

--
-- Table structure for table `journal_entries`
--

CREATE TABLE `journal_entries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `entry_text` text NOT NULL,
  `sentiment_score` decimal(5,4) DEFAULT NULL,
  `mood` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `journal_entries`
--

INSERT INTO `journal_entries` (`id`, `user_id`, `entry_text`, `sentiment_score`, `mood`, `created_at`) VALUES
(13, 3, 'It\'s getting late but I need to do this hard part of the  projected sorted out. It\'s little frustrating but once I will done with it I will be happy!', 0.9970, 'POSITIVE', '2025-01-22 17:20:46');

-- --------------------------------------------------------

--
-- Table structure for table `mood_metrics`
--

CREATE TABLE `mood_metrics` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `mood` varchar(50) NOT NULL,
  `count` int(11) DEFAULT 1,
  `recorded_date` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mood_metrics`
--

INSERT INTO `mood_metrics` (`id`, `user_id`, `mood`, `count`, `recorded_date`) VALUES
(5, 3, 'POSITIVE', 1, '2025-01-22'),
(6, 3, 'POSITIVE', 1, '2025-01-22');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `user_id`, `token`, `created_at`, `expires_at`) VALUES
(2, 3, '42cde78acd248540a78a6c3f4f1abfcb7e90b803ccc79bfe20f508aa43c020fc', '2025-01-20 08:17:26', '2025-01-20 09:17:26');

-- --------------------------------------------------------

--
-- Table structure for table `prompts`
--

CREATE TABLE `prompts` (
  `id` int(11) NOT NULL,
  `text` varchar(255) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prompts`
--

INSERT INTO `prompts` (`id`, `text`, `category`, `created_at`) VALUES
(1, 'This is the example of prompts.', 'Gratitude', '2025-01-21 05:31:15'),
(2, 'This is the example of prompts 2.', 'Ambition', '2025-01-21 05:31:38'),
(3, 'This is the example of prompts 3.', 'Love', '2025-01-21 05:31:51'),
(4, 'This prompt is added via Thunder client using API not database tool', 'Care', '2025-01-21 06:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `theme` varchar(50) DEFAULT 'light',
  `notification` tinyint(1) DEFAULT 1,
  `language` varchar(10) DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `user_id`, `theme`, `notification`, `language`) VALUES
(1, 3, 'light', 1, 'en');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `user_id`, `token`, `expires_at`) VALUES
(1, 2, '1df510aebe21e993b773601afaafc8259d08b0ec316f5c7d548f902c4fd01eae', '2025-01-20 02:16:53'),
(2, 3, 'eb044558a8a56127220bb2c85d8b332195e7282fece622e7b653bc8688c12756', '2025-01-20 02:39:58'),
(3, 3, '451ea07ad2d6fbb61139caad949ad317e7dd94e3093aa9d8d8e65b3a083eb2d5', '2025-01-20 02:55:26'),
(4, 3, '1f44024b55a051d15b7f583c98fee0af490f57ecfa9a59c6b8ab5192345bc201', '2025-01-20 03:08:47'),
(5, 3, '7437ebe9b485e64797ec956c2832ed695e50619a4f5ea94f17d60b6ef2d0ff9d', '2025-01-20 03:40:16'),
(6, 3, '242c53589396caaa16663fe0c4c6e0f51272ee2d664b43abb4cd27623c099521', '2025-01-20 10:11:02'),
(7, 3, '071751e6ec19471629617111b134805d648b0b36b6ee04bf6bf4df2dbfb3f626', '2025-01-21 07:07:47'),
(8, 3, '00840597462e7c1368483812a6962df8dc51565011d0425a7badee758791eeb2', '2025-01-21 08:08:17'),
(9, 3, '3006ebe22adce52d8882051ee2ee8686651b8fea462b8fd9d89fd7d1a82626c1', '2025-01-21 11:18:16'),
(10, 3, '0e2cf1b7e02b81a596020e0ba46fc7a0b755d7744ad1dc65c12bc26a2dc289e0', '2025-01-21 20:03:39'),
(11, 3, '5d87e34aacb8d10f72acc94c6b1731a89abf88aff5d6fa5fafb526a9f7cbea3d', '2025-01-21 22:10:39'),
(12, 3, '0eed7486d7e834eb3d7ef8781028827105b66c3c4bb569cd27de00a636b40aec', '2025-01-22 18:17:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'shishir', 'shishir@adoteapp.com', 'password', '2025-01-19 17:03:37', '2025-01-19 17:03:37'),
(2, 'testuser', 'test@example.com', '$2y$10$hJF5baN5jZFkoX5nBtfd8.Y8D01L1ZMAhgFfoyPoeMpjrY3iVA1ky', '2025-01-20 06:44:45', '2025-01-20 06:44:45'),
(3, 'testuser2', 'test2@example.com', '$2y$10$73IzS9CUuWQX.eUbwHNXcuE.ln8TgythVOIOT246E1TJU4T54wh76', '2025-01-20 07:09:42', '2025-01-20 07:45:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blacklisted_tokens`
--
ALTER TABLE `blacklisted_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `mood_metrics`
--
ALTER TABLE `mood_metrics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `prompts`
--
ALTER TABLE `prompts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blacklisted_tokens`
--
ALTER TABLE `blacklisted_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `mood_metrics`
--
ALTER TABLE `mood_metrics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `prompts`
--
ALTER TABLE `prompts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD CONSTRAINT `journal_entries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mood_metrics`
--
ALTER TABLE `mood_metrics`
  ADD CONSTRAINT `mood_metrics_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
