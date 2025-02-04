-- phpMyAdmin SQL Dump
-- version 5.2.1deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 05, 2025 at 01:14 AM
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
(14, 'd2f32232ac0d20eaabeca5458f7fd2070b879a088a81279dcbd7590c520677a8', '2025-01-26 19:42:55'),
(15, '6e3bc93225b3f15d4a121499b239ad63e269d0f72ed6e3380b75dced0c614488', '2025-01-27 20:58:25'),
(16, 'eaaf2a395f3d9305d876a126cd21c785072e4ba7ae49e1fac40e792c9fd63d88', '2025-01-27 20:59:32'),
(17, '4e12c6267ab111484de6318013f2569e7ceb7f5c638dba1f0be281b3bd271a09', '2025-01-27 21:56:39'),
(18, '686c3b8cc917881586d0f1d73bfbb657a3e5d16851c18f787d615deb2fa23644', '2025-01-28 20:16:26'),
(19, 'b90f8a131c749d451c69fe35f5d182726d1d948294d70fab557c74f47871daab', '2025-01-28 21:02:00'),
(20, 'de177b4c8d9346bd913133730923115894903452f7578c974bd7360252f046e6', '2025-01-29 22:29:44'),
(21, 'e12c99d8e53428110755501c650a637037f940e8a4b476a8aa1a3277403a3e7f', '2025-02-01 17:56:35'),
(22, '745e49e38594b477c4e73bad51870623d1999da155f656894ac027d556a964cf', '2025-02-03 04:51:38'),
(23, 'af63e7153c0977cf75970200a503039e955f01442f4171c0ba6a1a767d049291', '2025-02-03 05:55:35'),
(24, 'bc37b850351f724e2e7566c872916a8e2fd435807d71a5975bb91b5ce6fcd7d4', '2025-02-03 06:53:02'),
(25, '706d402a1e7d735aa3d90e7a1e6c65f11380b0ab34bc0c9a008a498db27d2bf1', '2025-02-03 20:29:54');

-- --------------------------------------------------------

--
-- Table structure for table `journal_classifiers`
--

CREATE TABLE `journal_classifiers` (
  `id` int(11) NOT NULL,
  `journal_entries_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `classifier` varchar(250) NOT NULL,
  `score` decimal(5,4) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `journal_classifiers`
--

INSERT INTO `journal_classifiers` (`id`, `journal_entries_id`, `user_id`, `classifier`, `score`, `created_at`) VALUES
(1, 32, 8, 'Goal Setting', 0.9828, '2025-02-04 19:35:45'),
(2, 32, 8, 'Personal Reflection', 0.6735, '2025-02-04 19:35:45'),
(3, 32, 8, 'Learning and Growth', 0.6229, '2025-02-04 19:35:45'),
(4, 33, 8, 'Personal Reflection', 0.9418, '2025-02-04 19:41:05'),
(5, 33, 8, 'Learning and Growth', 0.8206, '2025-02-04 19:41:05'),
(6, 33, 8, 'Goal Setting', 0.7282, '2025-02-04 19:41:05');

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
(25, 8, 'First day of the new month, and I\'m determined to make it a good one. Started with a morning run - it was tough to get out of bed, but I felt amazing afterward. Made a healthy breakfast and actually sat down to enjoy it instead of rushing. Work was busy but productive. In the evening, I finally started that painting I\'ve been putting off. It\'s not perfect, but it feels good to create something. Here\'s to a month of small, positive changes.', 0.9996, 'POSITIVE', '2025-01-27 07:36:20'),
(26, 8, 'Today was a bad day. Today I felt very very awful. ', 0.9997, 'NEGATIVE', '2025-01-30 19:30:43'),
(27, 14, 'Today started good, I wake and then sleep again. I saw a weird dream too. It was certainly negative dream. But these dreams do not affect me at all. I know, there are people who experience nightmares, I feel so bad about them. What those people feel who experience sleep paralysis. ', 0.9914, 'NEGATIVE', '2025-02-03 06:33:22'),
(28, 14, 'Life is just going on. I don\'t have any control over it.  I am just living it as it is. I am tired of it. I am waiting for it to finish fast.', 0.9993, 'NEGATIVE', '2025-02-03 06:43:01'),
(29, 14, 'Will in future I will ever have  a satisfied life. Will my situation ever improve? I have totally miserable life. I am too tired of it. ', 0.9996, 'NEGATIVE', '2025-02-03 06:52:25'),
(30, 8, 'Today was such a awesome day. I love the fact I met my old friends. We enjoyed moutain treking. ', 0.9999, 'POSITIVE', '2025-02-03 06:54:56'),
(31, 8, 'Today was tough. I\'m struggling with anxiety and feeling overwhelmed at work.', 0.5887, 'POSITIVE', '2025-02-04 19:15:25'),
(32, 8, 'I\'m excited about my new project and set some ambitious goals for the next quarter.', 0.9998, 'POSITIVE', '2025-02-04 19:35:45'),
(33, 8, 'Met with my best friend today. We had a deep conversation about life and our dreams.', 0.9998, 'POSITIVE', '2025-02-04 19:41:05');

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
(18, 8, 'POSITIVE', 1, '2025-01-27'),
(19, 8, 'NEGATIVE', 1, '2025-01-31'),
(20, 14, 'NEGATIVE', 1, '2025-02-03'),
(21, 14, 'NEGATIVE', 1, '2025-02-03'),
(22, 14, 'NEGATIVE', 1, '2025-02-03'),
(23, 8, 'POSITIVE', 1, '2025-02-03'),
(24, 8, 'POSITIVE', 1, '2025-02-05'),
(25, 8, 'POSITIVE', 1, '2025-02-05'),
(26, 8, 'POSITIVE', 1, '2025-02-05');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `clickable_url` varchar(250) DEFAULT NULL,
  `is_read` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `clickable_url`, `is_read`, `created_at`) VALUES
(16, 3, 'Test Notification 2', 'Love you all!!', NULL, 0, '2025-01-31 20:02:35'),
(17, 8, 'Test Notification 2', 'Love you all!!', NULL, 1, '2025-01-31 20:02:36'),
(18, 13, 'Test Notification 2', 'Love you all!!', NULL, 0, '2025-01-31 20:02:36'),
(19, 3, 'Test Notification 2', 'Love you all!!', NULL, 0, '2025-01-31 20:51:00'),
(20, 8, 'Test Notification 2', 'Love you all!!', NULL, 1, '2025-01-31 20:51:00'),
(21, 13, 'Test Notification 2', 'Love you all!!', NULL, 0, '2025-01-31 20:51:00'),
(22, 3, 'Test Notification 2', 'Who knows what is true or what not, so don\'t worry!', NULL, 0, '2025-01-31 21:20:11'),
(23, 8, 'Test Notification 2', 'Who knows what is true or what not, so don\'t worry!', NULL, 1, '2025-01-31 21:20:11'),
(24, 13, 'Test Notification 2', 'Who knows what is true or what not, so don\'t worry!', NULL, 0, '2025-01-31 21:20:11'),
(25, 3, 'Welcome Alert', 'Welcome to our platform! We hope you have a great experience.', NULL, 0, '2025-02-01 20:40:18'),
(26, 8, 'Welcome Alert', 'Welcome to our platform! We hope you have a great experience.', NULL, 1, '2025-02-01 20:40:18'),
(27, 13, 'Welcome Alert', 'Welcome to our platform! We hope you have a great experience.', NULL, 0, '2025-02-01 20:40:18'),
(28, 3, 'System Maintenance', 'Scheduled maintenance on Sunday at 2 AM. Expect downtime of 30 minutes.', NULL, 0, '2025-02-01 20:41:30'),
(29, 8, 'System Maintenance', 'Scheduled maintenance on Sunday at 2 AM. Expect downtime of 30 minutes.', NULL, 1, '2025-02-01 20:41:30'),
(30, 13, 'System Maintenance', 'Scheduled maintenance on Sunday at 2 AM. Expect downtime of 30 minutes.', NULL, 0, '2025-02-01 20:41:30'),
(31, 3, 'Security Reminder', 'Never share your password with anyone. Stay safe!', NULL, 0, '2025-02-01 20:41:54'),
(32, 8, 'Security Reminder', 'Never share your password with anyone. Stay safe!', NULL, 1, '2025-02-01 20:41:54'),
(33, 13, 'Security Reminder', 'Never share your password with anyone. Stay safe!', NULL, 0, '2025-02-01 20:41:54'),
(34, 3, 'Feature Update', 'We\'ve added a new dark mode feature. Check it out in settings!', NULL, 0, '2025-02-01 20:42:31'),
(35, 8, 'Feature Update', 'We\'ve added a new dark mode feature. Check it out in settings!', NULL, 1, '2025-02-01 20:42:31'),
(36, 13, 'Feature Update', 'We\'ve added a new dark mode feature. Check it out in settings!', NULL, 0, '2025-02-01 20:42:31'),
(37, 3, 'Daily Motivation', 'Every challenge is an opportunity in disguise. Keep going!', NULL, 0, '2025-02-01 20:42:59'),
(38, 8, 'Daily Motivation', 'Every challenge is an opportunity in disguise. Keep going!', NULL, 1, '2025-02-01 20:42:59'),
(39, 13, 'Daily Motivation', 'Every challenge is an opportunity in disguise. Keep going!', NULL, 0, '2025-02-01 20:42:59'),
(40, 3, 'Discount Offer', 'Limited-time offer: Get 20% off on premium plans. Hurry up!', NULL, 0, '2025-02-01 20:43:30'),
(41, 8, 'Discount Offer', 'Limited-time offer: Get 20% off on premium plans. Hurry up!', NULL, 1, '2025-02-01 20:43:31'),
(42, 13, 'Discount Offer', 'Limited-time offer: Get 20% off on premium plans. Hurry up!', NULL, 0, '2025-02-01 20:43:31'),
(43, 3, 'System Alert', 'Unusual login detected. If this wasn\'t you, change your password immediately.', NULL, 0, '2025-02-01 20:43:52'),
(44, 8, 'System Alert', 'Unusual login detected. If this wasn\'t you, change your password immediately.', NULL, 1, '2025-02-01 20:43:53'),
(45, 13, 'System Alert', 'Unusual login detected. If this wasn\'t you, change your password immediately.', NULL, 0, '2025-02-01 20:43:53'),
(46, 3, 'Reminder', 'Don\'t forget to complete your profile for a personalized experience.', NULL, 0, '2025-02-01 20:44:30'),
(48, 13, 'Reminder', 'Don\'t forget to complete your profile for a personalized experience.', NULL, 0, '2025-02-01 20:44:30'),
(49, 3, 'Poem', 'Do not go gentle into the goodnight', NULL, 0, '2025-02-01 21:52:42'),
(50, 8, 'Poem', 'Do not go gentle into the goodnight', NULL, 1, '2025-02-01 21:52:42'),
(51, 13, 'Poem', 'Do not go gentle into the goodnight', NULL, 0, '2025-02-01 21:52:42'),
(52, 3, 'Chocolate: Your Natural Love Booster', 'Studies show that consuming chocolate releases compounds associated with feelings of love and well-being. Why not harness that power and enjoy a delicious piece today?', NULL, 0, '2025-02-03 07:02:26'),
(53, 8, 'Chocolate: Your Natural Love Booster', 'Studies show that consuming chocolate releases compounds associated with feelings of love and well-being. Why not harness that power and enjoy a delicious piece today?', NULL, 1, '2025-02-03 07:02:26'),
(54, 13, 'Chocolate: Your Natural Love Booster', 'Studies show that consuming chocolate releases compounds associated with feelings of love and well-being. Why not harness that power and enjoy a delicious piece today?', NULL, 0, '2025-02-03 07:02:26'),
(55, 14, 'Chocolate: Your Natural Love Booster', 'Studies show that consuming chocolate releases compounds associated with feelings of love and well-being. Why not harness that power and enjoy a delicious piece today?', NULL, 0, '2025-02-03 07:02:26'),
(56, 3, 'What\'s in your mind?', 'Write! Because writing helps you thinking clearly, reduces stress and make you happy!', 'http://localhost:3000/journal/create', 0, '2025-02-03 19:18:47'),
(57, 8, 'What\'s in your mind?', 'Write! Because writing helps you thinking clearly, reduces stress and make you happy!', 'http://localhost:3000/journal/create', 1, '2025-02-03 19:18:47'),
(58, 13, 'What\'s in your mind?', 'Write! Because writing helps you thinking clearly, reduces stress and make you happy!', 'http://localhost:3000/journal/create', 0, '2025-02-03 19:18:47'),
(59, 14, 'What\'s in your mind?', 'Write! Because writing helps you thinking clearly, reduces stress and make you happy!', 'http://localhost:3000/journal/create', 0, '2025-02-03 19:18:47'),
(60, 3, 'Why don\'t you write?', 'Who made you smile today? What you like about today?', 'http://localhost:3000/journal/create', 0, '2025-02-03 19:55:57'),
(61, 8, 'Why don\'t you write?', 'Who made you smile today? What you like about today?', 'http://localhost:3000/journal/create', 1, '2025-02-03 19:55:57'),
(62, 13, 'Why don\'t you write?', 'Who made you smile today? What you like about today?', 'http://localhost:3000/journal/create', 0, '2025-02-03 19:55:57'),
(63, 14, 'Why don\'t you write?', 'Who made you smile today? What you like about today?', 'http://localhost:3000/journal/create', 0, '2025-02-03 19:55:57');

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
(2, 8, 'dark', 1, 'en', '2025-01-28 20:55:04'),
(3, 13, 'system', 1, 'en', '2025-01-31 19:18:57'),
(4, 14, 'dark', 1, 'en', '2025-02-03 06:17:21');

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
(42, 8, '7e4c0124e5157d3d1410e189ae48145d346ed75f65517c8d36868343c24a0bf4', '2025-01-27 10:41:05'),
(49, 8, '6e3bc93225b3f15d4a121499b239ad63e269d0f72ed6e3380b75dced0c614488', '2025-01-27 21:50:44'),
(50, 8, 'eaaf2a395f3d9305d876a126cd21c785072e4ba7ae49e1fac40e792c9fd63d88', '2025-01-27 21:58:38'),
(51, 8, '4e12c6267ab111484de6318013f2569e7ceb7f5c638dba1f0be281b3bd271a09', '2025-01-27 22:53:41'),
(52, 8, '686c3b8cc917881586d0f1d73bfbb657a3e5d16851c18f787d615deb2fa23644', '2025-01-28 20:36:34'),
(53, 8, 'b90f8a131c749d451c69fe35f5d182726d1d948294d70fab557c74f47871daab', '2025-01-28 21:16:38'),
(55, 8, '65ebbdcc6d86f41623c7b0141fd7db9755f9eb8c4650594777bf901cfd4e33f3', '2025-01-28 22:04:29'),
(56, 8, '21cad48f564fb15a68bda075134b417dff67b460f36d950230822b3987dc1e54', '2025-01-29 21:00:09'),
(57, 8, '21a9a284dbc29618c88094a4f725895b71b9cfc60143631a40bd1786189e83b4', '2025-01-29 22:01:44'),
(58, 8, 'de177b4c8d9346bd913133730923115894903452f7578c974bd7360252f046e6', '2025-01-29 23:26:42'),
(59, 8, 'be48ecb2f4c87a5f314a565b9856677fd0777a809a2a0f0de81d7a881a744f67', '2025-01-29 23:29:57'),
(60, 8, '745dee8d2a4ea1900d86dfffbada858aafb0a994557eb802b0ea52eda669b9ec', '2025-01-30 19:42:38'),
(61, 8, '0a561fdf04e1258ffa025bc5bd17d1a1050318ec2f668e576874ada5296ac86e', '2025-01-31 21:49:46'),
(62, 8, 'e12c99d8e53428110755501c650a637037f940e8a4b476a8aa1a3277403a3e7f', '2025-02-01 18:32:08'),
(63, 8, 'd22db10bb828bba93ad8caad9aaeff93cdfdd5474eb7d9de97fc7a157250d307', '2025-02-01 18:56:58'),
(64, 8, '83df54d6cbc81010a319cac5859e4f33ed02fae776c6e510c449fd9e3b0e00a9', '2025-02-01 20:07:07'),
(65, 8, 'd1d5b31d7b525b4c4979c9c428744fee8f4ecfb83029bb05b35954ba998d5ac5', '2025-02-01 21:10:03'),
(66, 8, '3875b1ae46b0cc7bbb6d8f058e14fb9f9913ec72816b3e48b6562706342c734d', '2025-02-01 22:13:32'),
(67, 8, '745e49e38594b477c4e73bad51870623d1999da155f656894ac027d556a964cf', '2025-02-03 05:47:06'),
(68, 8, 'af63e7153c0977cf75970200a503039e955f01442f4171c0ba6a1a767d049291', '2025-02-03 05:59:00'),
(69, 14, 'bc37b850351f724e2e7566c872916a8e2fd435807d71a5975bb91b5ce6fcd7d4', '2025-02-03 07:00:12'),
(70, 8, '8ab4d00eee4c130fc0b90c0034a17c10f9a772e34923710450617088e5465c68', '2025-02-03 07:53:14'),
(71, 8, '42ec91866628c8e1d4449cd33ca5341298218dcc891f85510df90d7be22a3fc6', '2025-02-03 19:43:43'),
(72, 8, '706d402a1e7d735aa3d90e7a1e6c65f11380b0ab34bc0c9a008a498db27d2bf1', '2025-02-03 20:53:11'),
(73, 8, 'b76b7216368dea872059927a355c1efb20d4186aa73d3bcd817b88b1b00466e3', '2025-02-04 06:21:50'),
(74, 8, '1f25e567f8154e7eec96bf6675e00c49949eda380e05bc7d6751b03bb039719c', '2025-02-04 19:48:35');

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
(3, 'testuser2', 'test2@example.com', '$2y$10$G59DE4125i.rXe0C7eB7WecVmVmRhYD3wlrXU75sdA.lK4rPZ2l7y', '2025-01-20 07:09:42', '2025-01-24 18:33:58'),
(8, 'ashwani', 'ashwani@test.com', '$2y$10$M8ewLm758jRunwoCQH87yeAEj6/xk1SoCaKbsB7QlyHaHAawrzJEm', '2025-01-23 09:53:47', '2025-01-28 21:04:01'),
(13, 'setting_update_with_register', 'settingupdateregister@gmail.com', '$2y$10$pxZoLK38qvHIDhQ37a/5ku2AbQnyHC5NdIpvtv1uzd.3tIlMkuM8u', '2025-01-31 19:18:57', '2025-01-31 19:18:57'),
(14, 'testuser10', 'testuser10@example.com', '$2y$10$tO.m8BzHqPYjIDhL.QdmDOvhEy42ZAiLynG9A.bmPLHBqehaTYmpC', '2025-02-03 05:59:40', '2025-02-03 05:59:40');

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
-- Indexes for table `journal_classifiers`
--
ALTER TABLE `journal_classifiers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `journal_entries_id` (`journal_entries_id`),
  ADD KEY `user_id` (`user_id`);

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
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `journal_classifiers`
--
ALTER TABLE `journal_classifiers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `mood_metrics`
--
ALTER TABLE `mood_metrics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `prompts`
--
ALTER TABLE `prompts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `journal_classifiers`
--
ALTER TABLE `journal_classifiers`
  ADD CONSTRAINT `journal_classifiers_ibfk_1` FOREIGN KEY (`journal_entries_id`) REFERENCES `journal_entries` (`id`),
  ADD CONSTRAINT `journal_classifiers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

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
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

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
