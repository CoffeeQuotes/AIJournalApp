<?php 
require_once("../../../System/requirement.php");
use NotesApp\System\AppSettings;
use NotesApp\System\Database;
use NotesApp\System\AuthMiddleware;
use NotesApp\System\MoodAnalyzer;
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
    $id = isset($_GET['id']) ? (int) $_GET['id'] : null;

    if ($method === 'GET') {
        if ($id) {
            // Fetch a specific journal entry by ID
            if (!verifyJournalOwnership($userId, $id)) {
                throw new Exception('Unauthorized to access this journal entry', 403);
            }
            
            $stmt = $pdo->prepare("SELECT * FROM journal_entries WHERE id = :id AND user_id = :user_id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                $appSettings->respond([
                    'data' => $row,
                    'message' => 'Journal entry retrieved successfully!',
                    'status' => 200
                ]);
            } else {
                throw new Exception("Journal entry not found", 404);
            }
        } else {
            // Fetch all journal entries for the authenticated user
            $stmt = $pdo->prepare("SELECT * FROM journal_entries WHERE user_id = :user_id ORDER BY created_at DESC");
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $appSettings->respond([
                'data' => $rows,
                'message' => 'Journal entries retrieved successfully!',
                'status' => 200
            ]);
        }
    } elseif ($method === 'POST') {

        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['entry_text'])) {
            throw new Exception('Invalid input: entry_text is required.');
        }
        $moodAnalyzer = new MoodAnalyzer();
        $sentimentScore = $moodAnalyzer->analyzeSentiment($input['entry_text']);
        $mood = $moodAnalyzer->mapScoreToMood($sentimentScore);

        $stmt = $pdo->prepare("
            INSERT INTO journal_entries (user_id, entry_text, sentiment_score, mood, created_at)
            VALUES (:user_id, :entry_text, :sentiment_score, :mood, NOW())
        ");

        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':entry_text', $input['entry_text'], PDO::PARAM_STR);
        $stmt->bindParam(':sentiment_score', $sentimentScore, PDO::PARAM_STR);
        $stmt->bindParam(':mood', $mood, PDO::PARAM_STR);
        $stmt->execute();

        // Update mood metrics 
        $stmt = $pdo->prepare("INSERT INTO mood_metrics (user_id, mood, count, recorded_date) VALUES (:user_id, :mood, 1, CURDATE()) ON DUPLICATE KEY UPDATE count = count + 1");
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':mood', $mood);
        $stmt->execute();

        $appSettings->respond([
            'data' => [
                'id' => $pdo->lastInsertId(),
                'user_id' => $userId,
                'entry_text' => $input['entry_text'],
                'sentiment_score' => $sentimentScore,
                'mood' => $mood,
                'created_at' => date('Y-m-d H:i:s')
            ],
            'message' => 'Journal entry added successfully!',
            'status' => 201
        ]);

    } elseif ($method === 'DELETE' && $id) {
        if (!verifyJournalOwnership($userId, $id)) {
            throw new Exception('Unauthorized to delete this journal entry', 403);
        }

        $stmt = $pdo->prepare("DELETE FROM journal_entries WHERE id = :id AND user_id = :user_id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $appSettings->respond([
                'message' => "Journal entry deleted successfully!",
                'status' => 200
            ]);
        } else {
            throw new Exception("Journal entry not found", 404);
        }
    } else {
        throw new Exception('Unsupported request method or missing ID.');
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

function verifyJournalOwnership($userId, $journalId) {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    $stmt = $pdo->prepare("SELECT user_id FROM journal_entries WHERE id = ? AND user_id = ?");
    $stmt->execute([$journalId, $userId]);
    $journal = $stmt->fetch(PDO::FETCH_ASSOC);
    
    return $journal !== false;
}