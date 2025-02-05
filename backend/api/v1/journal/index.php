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
            // Get pagination parameters
            $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
            $offset = ($page - 1) * $limit;

            // Get sorting parameters
            $sortBy = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'created_at';
            $order = isset($_GET['order']) && in_array(strtoupper($_GET['order']), ['ASC', 'DESC']) ? strtoupper($_GET['order']) : 'DESC';

            // Validate sortable columns
            $allowedSortColumns = ['id', 'created_at', 'sentiment_score'];
            if (!in_array($sortBy, $allowedSortColumns)) {
                $sortBy = 'created_at';
            }

            // Prepare SQL query
            $stmt = $pdo->prepare("SELECT * FROM journal_entries WHERE user_id = :user_id ORDER BY $sortBy $order LIMIT :limit OFFSET :offset");
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $journalEntries = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get total count
            $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM journal_entries WHERE user_id = :user_id");
            $countStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $countStmt->execute();
            $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

            // Initialize an array to hold journal entries with classifiers
            $journalEntriesWithClassifiers = [];

            // Loop through each journal entry
            foreach ($journalEntries as $entry) {
                // Prepare SQL query to fetch classifiers for the current journal entry
                $stmt = $pdo->prepare("
                    SELECT * FROM journal_classifiers
                    WHERE journal_entries_id = :journal_entries_id
                ");
                
                // Bind parameters
                $stmt->bindParam(':journal_entries_id', $entry['id'], PDO::PARAM_INT);
                
                // Execute query
                $stmt->execute();
                $classifiers = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Add the classifiers to the journal entry
                $entry['classifiers'] = $classifiers;

                // Add the journal entry with classifiers to the result array
                $journalEntriesWithClassifiers[] = $entry;
            }


            // Respond with paginated results
            $appSettings->respond([
                'data' => $journalEntriesWithClassifiers,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $limit,
                    'total_entries' => (int) $totalCount,
                    'total_pages' => ceil($totalCount / $limit)
                ],
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
        $analysisResult = $moodAnalyzer->analyzeSentiment($input['entry_text']);
        $mood = $analysisResult['sentiment'];
        $sentimentScore = $analysisResult['score'];
        $classifiers = $analysisResult['categories'];
    
        $stmt = $pdo->prepare("
            INSERT INTO journal_entries (user_id, entry_text, sentiment_score, mood, created_at)
            VALUES (:user_id, :entry_text, :sentiment_score, :mood, NOW())
        ");
    
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':entry_text', $input['entry_text'], PDO::PARAM_STR);
        $stmt->bindParam(':sentiment_score', $sentimentScore, PDO::PARAM_STR);
        $stmt->bindParam(':mood', $mood, PDO::PARAM_STR);
        $stmt->execute();
        $journalId = $pdo->lastInsertId();
    
        // Update mood metrics 
        $stmt = $pdo->prepare("
            INSERT INTO mood_metrics (user_id, mood, count, recorded_date) 
            VALUES (:user_id, :mood, 1, CURDATE()) 
            ON DUPLICATE KEY UPDATE count = count + 1
        ");
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':mood', $mood);
        $stmt->execute();
        
        // Update journal_classifiers
        foreach($classifiers as $classifier) { 
            $stmt = $pdo->prepare("
                INSERT INTO journal_classifiers (journal_entries_id, user_id, classifier, score, created_at)
                VALUES (:journal_entry_id, :user_id, :classifier, :score, NOW())
            ");
            $stmt->bindParam(':journal_entry_id', $journalId);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':classifier', $classifier['category']);
            $stmt->bindParam(':score', $classifier['score']);
            $stmt->execute();
        }

        $appSettings->respond([
            'data' => [
                'id' => $journalId,
                'user_id' => $userId,
                'entry_text' => $input['entry_text'],
                'sentiment_score' => $sentimentScore,
                'mood' => $mood,
                'classifiers' => $classifiers,
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