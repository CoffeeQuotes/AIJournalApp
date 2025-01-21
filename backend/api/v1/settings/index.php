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
        // Get Columns from settings table 
        $stmt = $pdo->query("SELECT * FROM settings LIMIT 0");
        $cols = array();
        for ($i = 0; $i < $stmt->columnCount(); $i++) {
            $col = $stmt->getColumnMeta($i);
            $cols[] = $col['name'];
        }
        $cols = array_splice($cols, 2);

        // Get and decode JSON input with error handling
        $input = json_decode(file_get_contents('php://input'), true);
        // Validate JSON
        validateJSONInput($input);    
        // Check if input is empty
        if (count($input) === 0) {
            throw new Exception('Invalid input: At least one parameter is required.');   
        }

        // Check if input keys are valid column names
        $invalidKeys = array_diff(array_keys($input), $cols);
        if (!empty($invalidKeys)) {
            throw new Exception('Invalid parameters: ' . implode(', ', $invalidKeys));
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

        $sql = "UPDATE settings SET " . implode(', ', $setClause) . " WHERE user_id = :user_id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        // Prepare response data by merging all data
        $responseData = array_merge([
            'id' => $pdo->lastInsertId(),
            'user_id' => $userId,
            'created_at' => date('Y-m-d H:i:s')
        ], $input);  // This adds all the updated settings to the response

        $appSettings->respond([
            'data' => $responseData,
            'message' => 'Setting/Settings updated successfully!',
            'status' => 201
        ]);
        
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
        // Get JSON error message
        switch (json_last_error()) {
            case JSON_ERROR_NONE:
                $error = 'No errors';
                break;
            case JSON_ERROR_DEPTH:
                $error = 'Maximum stack depth exceeded';
                break;
            case JSON_ERROR_STATE_MISMATCH:
                $error = 'Underflow or the modes mismatch';
                break;
            case JSON_ERROR_CTRL_CHAR:
                $error = 'Unexpected control character found';
                break;
            case JSON_ERROR_SYNTAX:
                $error = 'Syntax error, malformed JSON';
                break;
            case JSON_ERROR_UTF8:
                $error = 'Malformed UTF-8 characters';
                break;
            default:
                $error = 'Unknown error';
                break;
        }
        throw new Exception('Invalid JSON input: ' . $error);
    }
 }