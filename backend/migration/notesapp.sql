-- phpMyAdmin SQL Dump
-- version 5.2.1deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 27, 2025 at 03:32 PM
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
(3, '7437ebe9b485e64797ec956c2832ed695e50619a4f5ea94f17d60b6ef2d0ff9d', '2025-01-20 08:40:06'),
(4, 'dfc68bad656e01a3ed22a67e1d7d96e2c2ea37d329774d5862312c908a0c850a', '2025-01-23 09:21:30'),
(5, 'b4bd9c0f379f295f4e6eb4254347647be64fdacca0a1c5087fc3229572af77d8', '2025-01-23 09:29:58'),
(6, '5156994f387f78361ca23b5494d3e9ffa4d444aa7df5dc8ec96c0a7cc4c0cc17', '2025-01-23 09:49:28'),
(7, 'f77b707dc4bb4a8b8c20061325975c061b9fcdd98e79bc5901905ebdb7412508', '2025-01-23 21:40:15'),
(8, 'c737b7e277c92e80d1b6c50fed26ba7c2424b5036827593627ee1af31b338acd', '2025-01-23 22:36:24'),
(9, '40b9101b3081b84a16bc06fd40dfca2a30d63ad28d33c1fe4fd5b51c5a1e8dbd', '2025-01-23 22:37:13'),
(10, '993c0826c177dfbd0d18be8fe0fb3912a2d7461deea33e7568c8b95481f45a49', '2025-01-24 09:18:32'),
(11, '2a46fd9c2346b9e1fa3c7a30bcf8a903c3099d74810d6db0d3010ea3390474bf', '2025-01-26 18:48:58'),
(12, '0e732207c09b4454fd95d08c268369160d24e76e5b74cdb567c7a4c9cee7af00', '2025-01-26 19:11:18'),
(13, 'd30509e454968748b55140276af221dde8f05c6b9ad83c36be1e5c3259411e8e', '2025-01-26 19:14:33'),
(14, 'd2f32232ac0d20eaabeca5458f7fd2070b879a088a81279dcbd7590c520677a8', '2025-01-26 19:42:55');

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
(14, 8, 'Life is a miseralble rat race. We might have made it miserable ourself. We are the one blame it. We stucked our eyes upon the Gold but we are collecting dust, that slips away from hand in the end. ', 0.9988, 'NEGATIVE', '2025-01-24 09:24:20'),
(15, 8, 'What a person like me do? I have worked as cooperate slave for few years. I absolutely hate it. I don\'t have money to start any respectful small business. I don\'t like to have family and kids. I am happy with whoever is currently are in my life. I want simple life. But Society forces me to follow their rules.', 0.9791, 'POSITIVE', '2025-01-24 09:27:41'),
(16, 8, 'It\'s getting late but I need to do this hard part of the  projected sorted out. It\'s little frustrating but once I will done with it I will be happy!', 0.9970, 'POSITIVE', '2025-01-24 09:31:28'),
(17, 8, 'Ashwani is currently only friend I have. I like his many things, but absolutely don\'t like his few things. I find him sometimes immature to think that I won\'t understand few things. I certainly underestimate my understanding of dynamics. But I let him assume that for friendship only.', 0.9888, 'NEGATIVE', '2025-01-24 09:35:55'),
(18, 8, 'Today was great day in the history of India. Today we have become republic nation. Wow!', 0.9998, 'POSITIVE', '2025-01-26 11:19:22'),
(19, 8, 'Today was a rollercoaster. I woke up feeling energized and tackled my to-do list with gusto. Finished that report for work ahead of schedule, which felt amazing. Had lunch with Sarah, and we couldn\'t stop laughing about old college stories. But then I got that call from Mom - Dad\'s test results came back, and it\'s not good news. I\'m trying to stay positive, but I\'m scared. Ended the night with some mindfulness exercises. Deep breaths. Tomorrow is a new day.', 0.9912, 'NEGATIVE', '2025-01-27 07:31:31'),
(20, 8, 'Today was a rollercoaster. I woke up feeling energized and tackled my to-do list with gusto. Finished that report for work ahead of schedule, which felt amazing. Had lunch with Sarah, and we couldn\'t stop laughing about old college stories. But then I got that call from Mom - Dad\'s test results came back, and it\'s not good news. I\'m trying to stay positive, but I\'m scared. Ended the night with some mindfulness exercises. Deep breaths. Tomorrow is a new day.', 0.9912, 'NEGATIVE', '2025-01-27 07:31:31'),
(21, 8, 'Ugh, what a day. Overslept and was late for my important meeting. My boss was not happy. Spilled coffee on my new shirt right before my presentation. I fumbled through it, and I\'m pretty sure everyone could tell how unprepared I was. To top it off, my car wouldn\'t start after work. Had to call for a tow. I just want this day to be over. Maybe tomorrow will be better.', 0.9993, 'NEGATIVE', '2025-01-27 07:34:31'),
(22, 8, 'I can\'t believe it - I got the promotion! All that hard work finally paid off. Called Mom and Dad right away, and they were over the moon. Treated myself to a fancy dinner and a glass of champagne. I feel like I\'m walking on air. Can\'t wait to see what this new role brings. Note to self: celebrate the wins, big and small.', 0.9996, 'POSITIVE', '2025-01-27 07:34:55'),
(23, 8, 'Spent the whole day at the beach with friends. The sun, the waves, the laughter - it was exactly what I needed. We played volleyball (I\'m still terrible, but who cares?), had a picnic, and stayed to watch the sunset. Feeling refreshed and grateful for these moments of pure joy. Mental note: make more time for days like this.', 0.9998, 'POSITIVE', '2025-01-27 07:35:23'),
(24, 8, 'Feeling a bit lost today. Can\'t shake this sense of uncertainty about my future. Am I on the right path? Should I be doing more? Tried to distract myself with a new book, but couldn\'t focus. Ended up calling my sister, and she always knows how to put things in perspective. Still not sure about everything, but feeling a bit more grounded. Tomorrow, I\'ll make a list of goals. Baby steps.', 0.9780, 'POSITIVE', '2025-01-27 07:35:54'),
(25, 8, 'First day of the new month, and I\'m determined to make it a good one. Started with a morning run - it was tough to get out of bed, but I felt amazing afterward. Made a healthy breakfast and actually sat down to enjoy it instead of rushing. Work was busy but productive. In the evening, I finally started that painting I\'ve been putting off. It\'s not perfect, but it feels good to create something. Here\'s to a month of small, positive changes.', 0.9996, 'POSITIVE', '2025-01-27 07:36:20');

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
(6, 3, 'POSITIVE', 1, '2025-01-22'),
(7, 8, 'NEGATIVE', 1, '2025-01-24'),
(8, 8, 'POSITIVE', 1, '2025-01-24'),
(9, 8, 'POSITIVE', 1, '2025-01-24'),
(10, 8, 'NEGATIVE', 1, '2025-01-24'),
(11, 8, 'POSITIVE', 1, '2025-01-26'),
(12, 8, 'NEGATIVE', 1, '2025-01-25'),
(13, 8, 'NEGATIVE', 1, '2025-01-26'),
(14, 8, 'NEGATIVE', 1, '2025-01-25'),
(15, 8, 'POSITIVE', 1, '2025-01-26'),
(16, 8, 'POSITIVE', 1, '2025-01-24'),
(17, 8, 'POSITIVE', 1, '2025-01-27'),
(18, 8, 'POSITIVE', 1, '2025-01-27');

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
(2, 3, '42cde78acd248540a78a6c3f4f1abfcb7e90b803ccc79bfe20f508aa43c020fc', '2025-01-20 08:17:26', '2025-01-20 09:17:26'),
(4, 3, '17ae06060c0ab7c366c18667573690874706d50ae932d98d5d95fec881aaccb1', '2025-01-26 17:27:31', '2025-01-26 18:27:31'),
(5, 3, 'b32e14276f6255085083e84960d2b06d875840fa53a022049503744d98c97844', '2025-01-26 17:35:36', '2025-01-26 18:35:36'),
(6, 3, 'fa7fb930ff400c8f869210d604aed003beba40970b4055401c2cd17ea1c1ff65', '2025-01-26 17:37:08', '2025-01-26 18:37:08');

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
(1, 'What\'s the most challenging thing you\'ve overcome recently?', 'Personal Growth', '2025-01-27 09:17:33'),
(2, 'Describe a moment today that made you smile.', 'Daily Reflection', '2025-01-27 09:17:33'),
(3, 'What\'s one thing you\'re looking forward to this week?', 'Future Planning', '2025-01-27 09:17:33'),
(4, 'Reflect on a recent decision you made. How do you feel about it now?', 'Decision Making', '2025-01-27 09:17:33'),
(5, 'What\'s a small act of kindness you witnessed or performed today?', 'Gratitude', '2025-01-27 09:17:33'),
(6, 'If you could change one thing about your day, what would it be?', 'Self-Improvement', '2025-01-27 09:17:33'),
(7, 'What\'s a new skill or hobby you\'d like to learn? Why?', 'Personal Development', '2025-01-27 09:17:33'),
(8, 'Describe your ideal day. What would you do?', 'Future Vision', '2025-01-27 09:17:33'),
(9, 'What\'s a fear you\'d like to overcome? How might you start?', 'Personal Growth', '2025-01-27 09:17:33'),
(10, 'Write about a person who inspires you and why.', 'Gratitude', '2025-01-27 09:17:33'),
(11, 'What is something that you have accomplished this week that you are proud of?', 'Accomplishments', '2025-01-27 09:17:33'),
(12, 'Describe a time when you had to adapt to a big change.', 'Adaptability', '2025-01-27 09:17:33'),
(13, 'How do you usually deal with stressful situations?', 'Coping Mechanisms', '2025-01-27 09:17:33'),
(14, 'What do you value most in your friendships?', 'Relationships', '2025-01-27 09:17:33'),
(15, 'Write about a place that holds special meaning for you.', 'Nostalgia', '2025-01-27 09:17:33'),
(16, 'What is one goal you would like to accomplish in the next year?', 'Future Goals', '2025-01-27 09:17:33'),
(17, 'Describe a book, movie, or piece of art that has made a lasting impact on you.', 'Inspiration', '2025-01-27 09:17:33'),
(18, 'If you could go back in time and give advice to your younger self, what would it be?', 'Past Reflection', '2025-01-27 09:17:33'),
(19, 'What’s a habit you’d like to break and a new habit you’d like to build?', 'Self-Improvement', '2025-01-27 09:17:33'),
(20, 'What are you grateful for today?', 'Gratitude', '2025-01-27 09:17:33'),
(21, 'What’s one thing you learned today?', 'Learning', '2025-01-27 09:17:33'),
(22, 'How did you take care of yourself today?', 'Self-Care', '2025-01-27 09:17:33'),
(23, 'What are you most excited about in your life right now?', 'Excitement', '2025-01-27 09:17:33'),
(24, 'What boundaries have you set or need to set?', 'Boundaries', '2025-01-27 09:17:33'),
(25, 'What is your definition of a perfect day and why?', 'Ideal Life', '2025-01-27 09:17:33');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `theme` varchar(50) DEFAULT 'light',
  `notification` tinyint(1) DEFAULT 1,
  `language` varchar(10) DEFAULT 'en',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `user_id`, `theme`, `notification`, `language`, `created_at`) VALUES
(1, 3, 'light', 1, 'en', '2025-01-27 09:47:07'),
(2, 8, 'light', 0, 'en', '2025-01-27 10:00:03');

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
(39, 8, 'bfecee80b7211a4e29f74f290502590577ba3b162ed1f59a73c0e361f086490b', '2025-01-27 07:15:17'),
(40, 8, 'f5f879cfb7cfb8221fdeda66a95a11911defa54a187d9ad86165f6ed53799230', '2025-01-27 08:17:36'),
(41, 8, 'ab6c11d8f04cc4cea73a407e9ba604dd8ddfb1fa1bd5001cd3e16f760d433ca0', '2025-01-27 09:23:42'),
(42, 8, '7e4c0124e5157d3d1410e189ae48145d346ed75f65517c8d36868343c24a0bf4', '2025-01-27 10:41:05');

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
(3, 'testuser2', 'test2@example.com', '$2y$10$G59DE4125i.rXe0C7eB7WecVmVmRhYD3wlrXU75sdA.lK4rPZ2l7y', '2025-01-20 07:09:42', '2025-01-24 18:33:58'),
(4, 'testuser3', 'test3@example.com', '$2y$10$FliqDpNw00gzJ8dkqRP1lu7y3ZqeJO4td20aGhp5/WW/uI/VEomXG', '2025-01-23 06:56:39', '2025-01-23 06:56:39'),
(5, 'testuser4', 'testuser4@example.com', '$2y$10$e3IyRq3nJCPjRclotr4VPOAJEkLyf4orn2a/l4xrtaENinI1.DZR2', '2025-01-23 07:16:40', '2025-01-23 07:16:40'),
(6, 'testuser5', 'test5@example.com', '$2y$10$46IoannE7DtZowuPetKCWO97USI1PCLyQLbhgiGw.gHu2W7zXKGZC', '2025-01-23 09:14:19', '2025-01-23 09:14:19'),
(7, 'testuser6', 'test6@gmail.com', '$2y$10$EwjjvkSZQh8.K79.hfyMJ.KwDM6Gz2L84eGCDuWGjmzfisOOPohRm', '2025-01-23 09:31:23', '2025-01-23 09:31:23'),
(8, 'ashwani', 'ashwani@test.com', '$2y$10$CHs32Zeh0f9fEwHwb2VlgOprgPeLCn74relPZ6.Apm0j5JFJapf3a', '2025-01-23 09:53:47', '2025-01-26 19:10:13');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `mood_metrics`
--
ALTER TABLE `mood_metrics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `prompts`
--
ALTER TABLE `prompts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
