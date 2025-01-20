<?php
namespace NotesApp\System;

class AuthMiddleware {
    private $auth;
    
    public function __construct() {
        $this->auth = new Auth();
    }
    
    public function authenticate() {
        // Get token from Authorization header
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        // Debug: Log the headers
        error_log('Auth Headers: ' . print_r($headers, true));
        
        if (empty($authHeader)) {
            throw new \Exception('No Authorization header provided', 401);
        }
        
        // Check for Bearer token format
        if (!preg_match('/^Bearer\s+(.*)$/i', $authHeader, $matches)) {
            throw new \Exception('Invalid Authorization header format. Must be: Bearer token', 401);
        }
        
        $token = $matches[1];
        error_log('Token being validated: ' . $token);
        
        try {
            $result = $this->auth->validateToken($token);
            error_log('Token validation result: ' . print_r($result, true));
            return $result['user_id'];
        } catch (\Exception $e) {
            error_log('Token validation error: ' . $e->getMessage());
            throw new \Exception('Unauthorized: ' . $e->getMessage(), 401);
        }
    }
}