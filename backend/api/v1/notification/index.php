<?php 
require_once("../../../System/requirement.php");

use NotesApp\System\AppSettings;
use NotesApp\System\Database;
use NotesApp\System\AuthMiddleware;
use ElephantIO\Client;

try {
    $dbInstance = Database::getInstance();
    $pdo = $dbInstance->getConnection();
    $appSettings = new AppSettings([
        'response_as_json' => true,
        'display_errors' => true,
    ]);

    // $authMiddleware = new AuthMiddleware();
    // Authenticate first and get user ID
    // $userId = $authMiddleware->authenticate();
    // Get the action from the GET variable
    $action = $_GET['action'] ?? ''; 
    
    // Send general Notification
    
    if ($action === 'send-general-notification') {
        // POST /api/v1/notification/index.php?action=send-general-notification

        $input = json_decode(file_get_contents('php://input'), true);
        $title = $input['title'] ?? '';
        $message = $input['message'] ?? '';
        // $userIds = $_POST['user_ids'] ?? [];
        // var_dump($title, $message);
        $stmt = $pdo->prepare("SELECT user_id FROM `settings` WHERE notification = 1");
        $stmt->execute();
        $userIds = $stmt->fetchAll(PDO::FETCH_COLUMN);
        // print_r($userIds);
        if (empty($title) || empty($message) || empty($userIds)) {
            $appSettings->respond([
                'message' => 'Missing required fields',
                'status' => 400
            ]);
            exit;
        }

        $url = "http://localhost:8080";

        $options = ['client' => Client::CLIENT_4X];

        $client = Client::create($url, $options);

        $client->connect();
        
        $client->of('/');

        $data = [
            'title' => $title,
            'message' => $message,
            'userIds' => $userIds
        ];
        $client->emit('general-notification', $data);

        $client->disconnect();


        $stmt = $pdo->prepare("
            INSERT INTO notifications (title, message, user_id, is_read)
            VALUES (:title, :message, :user_id, 0)
        ");

        foreach ($userIds as $userId) {
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':message', $message);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
        }

        $appSettings->respond([
            'message' => 'Notification sent successfully',
            'status' => 200
        ]);
    } elseif ($action === 'get-notifications') {
        // GET /api/v1/notification?action=get-notifications
        $stmt = $pdo->prepare("
            SELECT *
            FROM notifications
            WHERE user_id = :user_id
            ORDER BY created_at DESC
        ");
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $appSettings->respond([
            'data' => $notifications,
            'message' => 'Notifications retrieved successfully',
            'status' => 200
        ]);
    } elseif ($action === 'mark-as-read') {
        // POST /api/v1/notification?action=mark-as-read
        $notificationId = $_POST['notification_id'] ?? '';

        if (empty($notificationId)) {
            $appSettings->respond([
                'message' => 'Missing required fields',
                'status' => 400
            ]);
            exit;
        }

        $stmt = $pdo->prepare("
            UPDATE notifications
            SET is_read = 1
            WHERE id = :notification_id
        ");
        $stmt->bindParam(':notification_id', $notificationId);
        $stmt->execute();

        $appSettings->respond([
            'message' => 'Notification marked as read successfully',
            'status' => 200
        ]);
    } elseif ($action === 'mark-all-as-read') {
        // POST /api/v1/notification?action=mark-all-as-read
        $stmt = $pdo->prepare("
            UPDATE notifications
            SET is_read = 1
            WHERE user_id = :user_id
        ");
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();

        $appSettings->respond([
            'message' => 'All notifications marked as read successfully',
            'status' => 200
        ]);
    } else { 
        $appSettings->respond([
            'message' => 'Invalid action',
            'status' => 400
        ]);
        exit;
    }
} catch (Exception $e) { 
    $appSettings->respond([
        'message' => $e->getMessage(),
        'status' => 500
    ]);
    exit;
}