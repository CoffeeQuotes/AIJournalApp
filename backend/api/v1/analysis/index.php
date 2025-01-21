<?php
require_once("../../../System/requirement.php");

use NotesApp\System\AppSettings;
use NotesApp\System\Database;
use NotesApp\System\AuthMiddleware;

try {
    $dbInstance = Database::getInstance();
    $pdo = $dbInstance->getConnection();
    $appSettings = new AppSettings([
        'response_as_json' => true,
        'display_errors' => true,
    ]);

    $authMiddleware = new AuthMiddleware();
    
    // Authenticate first and get user ID
    $userId = $authMiddleware->authenticate();
    
    // Get the action from the GET variable
    $action = $_GET['action'] ?? '';

    if ($action === 'mood-trends') {
        // GET /api/v1/analysis?action=mood-trends
        $stmt = $pdo->prepare("
            SELECT mood, count, recorded_date 
            FROM mood_metrics 
            WHERE user_id = :user_id 
            ORDER BY recorded_date
        ");
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $appSettings->respond([
            'data' => $data, 
            'message' => 'Mood trends retrieved!', 
            'status' => 200
        ]);
    } elseif ($action === 'summary') {
        // GET /api/v1/analysis?action=summary
        $stmt = $pdo->prepare("
            SELECT mood, SUM(count) as total 
            FROM mood_metrics 
            WHERE user_id = :user_id 
            GROUP BY mood
        ");
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $appSettings->respond([
            'data' => $data, 
            'message' => 'Mood summary retrieved!', 
            'status' => 200
        ]);
    } else {
        // Invalid action
        $appSettings->respond([
            'message' => 'Invalid action!', 
            'status' => 404
        ]);
    }
} catch (Exception $e) {
    $status = $e->getCode();
    if (!$status || $status < 100 || $status > 599) {
        $status = 500;
    }
    
    $appSettings->respond([
        'error' => $e->getMessage(),
        'status' => $status
    ]);
}
