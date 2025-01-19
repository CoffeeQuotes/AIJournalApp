<?php 
require_once("../../../System/requirement.php");

use NotesApp\System\AppSettings;
use NotesApp\System\Database;

try {
    // Get the singleton database instance
    $dbInstance = Database::getInstance();

    // Get the PDO connection
    $pdo = $dbInstance->getConnection();

    // Initialize AppSettings for consistent responses
    $appSettings = new AppSettings([
        'response_as_json' => true,
        'display_errors' => true,
    ]);

    // Check the request method
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        // Handle GET request: Fetch all journal entries
        $stmt = $pdo->prepare("SELECT * FROM journal_entries");
        $stmt->execute();
        $rows = $stmt->fetchAll();

        $data = [
            'data' => $rows,
            'message' => 'Journal entries retrieved successfully!',
            'status' => 200
        ];

        $appSettings->respond($data);

    } elseif ($method === 'POST') {
        // Handle POST request: Insert a new journal entry

        // Get POST input (expects JSON input)
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['user_id'], $input['entry_text'], $input['sentiment_score'], $input['mood'])) {
            throw new Exception('Invalid input: user_id, entry_text, sentiment_score, and mood are required.');
        }

        // Prepare the insert query
        $stmt = $pdo->prepare("
            INSERT INTO journal_entries (user_id, entry_text, sentiment_score, mood, created_at)
            VALUES (:user_id, :entry_text, :sentiment_score, :mood, NOW())
        ");

        // Bind parameters
        $stmt->bindParam(':user_id', $input['user_id'], PDO::PARAM_INT);
        $stmt->bindParam(':entry_text', $input['entry_text'], PDO::PARAM_STR);
        $stmt->bindParam(':sentiment_score', $input['sentiment_score'], PDO::PARAM_STR);
        $stmt->bindParam(':mood', $input['mood'], PDO::PARAM_STR);

        // Execute the query
        $stmt->execute();

        // Respond with success
        $data = [
            'data' => [
                'id' => $pdo->lastInsertId(),
                'user_id' => $input['user_id'],
                'entry_text' => $input['entry_text'],
                'sentiment_score' => $input['sentiment_score'],
                'mood' => $input['mood'],
                'created_at' => date('Y-m-d H:i:s')
            ],
            'message' => 'Journal entry added successfully!',
            'status' => 201
        ];

        $appSettings->respond($data);

    } else {
        // Handle unsupported HTTP methods
        throw new Exception('Unsupported request method.');
    }
} catch (Exception $e) {
    // Handle errors
    $error = [
        'error' => $e->getMessage(),
        'status' => 500
    ];
    echo json_encode($error);
}
