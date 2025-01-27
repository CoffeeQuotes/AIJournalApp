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

    if($method === 'GET') {
        // Fetch user preference 
        $stmt = $pdo->prepare("SELECT * FROM settings WHERE user_id = :user_id");
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $appSettings->respond([
            'data' => $row,
            'message' => 'Settings retrieved successfully!',
            'status' => 200
        ]);
    } elseif($method === 'PUT') {
        // Get Columns from settings table using information_schema for better performance
        $stmt = $pdo->prepare("
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'settings'
            AND table_schema = DATABASE()
        ");
        $stmt->execute();
        $cols = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $cols = array_diff($cols, ['id', 'user_id', 'created_at']);
        
        // Get and decode JSON input with error handling
        $input = json_decode(file_get_contents('php://input'), true);
        // Validate JSON
        validateJSONInput($input);    
        // Check if input is empty
        if (count($input) === 0) {
            throw new Exception('Invalid input: At least one parameter is required.', 400);
        }
        
        // Check if input keys are valid column names
        $invalidKeys = array_diff(array_keys($input), $cols);
        if (!empty($invalidKeys)) {
            throw new Exception('Invalid parameters: ' . implode(', ', $invalidKeys), 400);
        }
        
        
        // Update the setting
        $setClause = [];
        $params = [];
        
        foreach ($input as $column => $value) {
            $setClause[] = "$column = :$column";
            $params[$column] = $value;
        }
        
        // Add user_id to params
        $params['user_id'] = $userId;
        
        // Check if the record for the user exists or not if not then insert
        $stmt = $pdo->prepare("SELECT * FROM settings WHERE user_id = :user_id");
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $responseData = [];
        if (!$row) {
            // Insert the new record
             $placeholders = implode(', ', array_map(fn($key) => ':' . $key, array_keys($input)));
    
            $sql = "INSERT INTO settings (user_id, created_at, " . implode(', ', array_keys($input)) . ") VALUES (:user_id, NOW(), " . $placeholders . ")";
             $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
             $insertedId = $pdo->lastInsertId();
        
             // Fetch the new record
            $stmt = $pdo->prepare("SELECT * FROM settings WHERE id = :id");
            $stmt->bindParam(':id', $insertedId, PDO::PARAM_INT);
            $stmt->execute();
            $responseData = $stmt->fetch(PDO::FETCH_ASSOC);
        
              $appSettings->respond([
                  'data' => $responseData,
                  'message' => 'Setting/Settings created successfully!',
                'status' => 201
            ]);
        } else {
            // Update the existing record
            $sql = "UPDATE settings SET created_at = NOW(), " . implode(', ', $setClause) . " WHERE user_id = :user_id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        
             // Fetch the updated record
            $stmt = $pdo->prepare("SELECT * FROM settings WHERE user_id = :user_id");
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $responseData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        
              $appSettings->respond([
                    'data' => $responseData,
                    'message' => 'Setting/Settings updated successfully!',
                    'status' => 200
               ]);
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

function validateJSONInput($input)
{
   if ($input === null) {
        $error = match(json_last_error()) {
          JSON_ERROR_NONE => 'No errors',
          JSON_ERROR_DEPTH => 'Maximum stack depth exceeded',
          JSON_ERROR_STATE_MISMATCH => 'Underflow or the modes mismatch',
          JSON_ERROR_CTRL_CHAR => 'Unexpected control character found',
           JSON_ERROR_SYNTAX => 'Syntax error, malformed JSON',
          JSON_ERROR_UTF8 => 'Malformed UTF-8 characters',
         default => 'Unknown error'
       };
       throw new Exception('Invalid JSON input: ' . $error, 400);
   }
}