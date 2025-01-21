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


    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'GET') {
        $random = isset($_GET['random']) ? (bool) $_GET['random'] : false;
        if(!$random) {
            $stmt = $pdo->prepare("SELECT * FROM prompts ORDER BY created_at DESC");
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $appSettings->respond([
                'data' => $rows,
                'message' => 'Prompts retrieved successfully!',
                'status' => 200
            ]);
        } else {
            // Fetch the total numbers of rows in prompts table.
            $stmt = $pdo->prepare("SELECT * FROM prompts ORDER BY RAND() LIMIT 1;");
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $appSettings->respond([
                'data' => $row,
                'message' => 'Prompt retrieved successfully!',
                'status' => 200,
            ]);
        }
    } else {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['text'], $input['category'])) {
            throw new Exception('Invalid input: text and category are required.');
        }

        $stmt = $pdo->prepare("
            INSERT INTO prompts (text, category, created_at)
            VALUES (:text, :category, NOW())
        ");
        $stmt->bindParam(':text', $input['text'], PDO::PARAM_STR);
        $stmt->bindParam(':category', $input['category'], PDO::PARAM_STR);
        $stmt->execute();

        $appSettings->respond([
            'data' => [
                'id' => $pdo->lastInsertId(),
                'text' => $input['text'],
                'category' => $input['category'],
                'created_at' => date('Y-m-d H:i:s')
            ],
            'message' => 'Prompt added successfully!',
            'status' => 201
        ]);
    }
} catch (Exception $e) {
    $status = $e->getCode();
    // If no status code is set, default to 500
    if (!$status || $status < 100 || $status > 599) {
        $status = 500;
    }
    
    $appSettings->respond([
        'error' => $e->getMessage(),
        'status' => $status
    ]);
}