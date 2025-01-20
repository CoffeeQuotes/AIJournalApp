<?php
require_once("../../../System/requirement.php");
use NotesApp\System\AppSettings;
use NotesApp\System\Auth;

$appSettings = new AppSettings(['response_as_json' => true]);

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $auth = new Auth();
    $input = json_decode(file_get_contents('php://input'), true);

    if ($method === 'POST' && isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'register':
                $id = $auth->register($input['username'], $input['email'], $input['password']);
                $appSettings->respond(['message' => 'User registered successfully!', 'user_id' => $id, 'status' => 201]);
                break;

            case 'login':
                $data = $auth->login($input['email'], $input['password']);
                $appSettings->respond(['message' => 'Login successful!', 'data' => $data, 'status' => 200]);
                break;

            case 'logout':
                $success = $auth->logout($input['token']);
                $appSettings->respond(['message' => 'Logout successful!', 'status' => 200]);
                break;

            case 'refresh':
                $data = $auth->refreshToken($input['token']);
                $appSettings->respond(['message' => 'Token refreshed successfully!', 'data' => $data, 'status' => 200]);
                break;

            case 'reset-password-request':
                $data = $auth->generatePasswordResetToken($input['email']);
                $appSettings->respond(['message' => 'Password reset token generated!', 'data' => $data, 'status' => 200]);
                break;

            case 'reset-password':
                $data = $auth->resetPassword($input['token'], $input['new_password']);
                $appSettings->respond(['message' => 'Password reset successfully!', 'status' => 200]);
                break;
        }
    } else {
        throw new Exception('Invalid endpoint or method.');
    }
} catch (Exception $e) {
    $appSettings->respond(['error' => $e->getMessage(), 'status' => 500]);
}