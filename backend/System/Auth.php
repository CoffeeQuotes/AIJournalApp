<?php
namespace NotesApp\System;

use PDO;

class Auth {
    private $pdo;

    public function __construct() {
        $db = Database::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function register($username, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $this->pdo->prepare("
            INSERT INTO users (username, email, password) VALUES (:username, :email, :password)
        ");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->execute();
        return $this->pdo->lastInsertId();
    }

    public function login($email, $password) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $token = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

            $stmt = $this->pdo->prepare("
                INSERT INTO tokens (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)
            ");
            $stmt->bindParam(':user_id', $user['id']);
            $stmt->bindParam(':token', $token);
            $stmt->bindParam(':expires_at', $expiresAt);
            $stmt->execute();

            return ['token' => $token, 'expires_at' => $expiresAt];
        }

        throw new \Exception('Invalid email or password.');
    }

    public function logout($token) {
        // Validate the token
        $stmt = $this->pdo->prepare("
            SELECT * FROM tokens WHERE token = :token AND expires_at > NOW()
        ");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $validToken = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if (!$validToken) {
            throw new \Exception('Invalid or expired token.');
        }
    
        // Blacklist the token
        $stmt = $this->pdo->prepare("INSERT INTO blacklisted_tokens (token) VALUES (:token)");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
    
        return ['message' => 'Logged out successfully'];
    }
    

    public function refreshToken($token) {
        $stmt = $this->pdo->prepare("SELECT * FROM tokens WHERE token = :token");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $currentToken = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($currentToken) {
            $newToken = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

            $stmt = $this->pdo->prepare("
                UPDATE tokens SET token = :new_token, expires_at = :expires_at WHERE id = :id
            ");
            $stmt->bindParam(':new_token', $newToken);
            $stmt->bindParam(':expires_at', $expiresAt);
            $stmt->bindParam(':id', $currentToken['id']);
            $stmt->execute();

            return ['token' => $newToken, 'expires_at' => $expiresAt];
        }

        throw new \Exception('Token not found or expired.');
    }

    public function generatePasswordResetToken($email) {
        $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($user) {
            $token = bin2hex(random_bytes(32));
            $stmt = $this->pdo->prepare("
                INSERT INTO password_resets (user_id, token, expires_at) 
                VALUES (:user_id, :token, DATE_ADD(NOW(), INTERVAL 1 HOUR))
            ");
            $stmt->bindParam(':user_id', $user['id']);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
    
            // Return token or send via email
            return ['message' => 'Password reset token generated!', 'token' => $token];
        } else {
            throw new \Exception('Email not found');
        }
    }
    public function resetPassword($token, $newPassword) {
        $stmt = $this->pdo->prepare("
            SELECT user_id FROM password_resets 
            WHERE token = :token AND expires_at > NOW()
        ");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $reset = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($reset) {
            $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
            $stmt = $this->pdo->prepare("UPDATE users SET password = :password WHERE id = :user_id");
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->bindParam(':user_id', $reset['user_id']);
            $stmt->execute();
    
            // Delete the token after use
            $stmt = $this->pdo->prepare("DELETE FROM password_resets WHERE token = :token");
            $stmt->bindParam(':token', $token);
            $stmt->execute();
    
            return ['message' => 'Password reset successfully!'];
        } else {
            throw new \Exception('Invalid or expired token');
        }
    }
    
    public function validateToken($token) {
        // Check if the token exists and is not expired
        $stmt = $this->pdo->prepare("
            SELECT * FROM tokens 
            WHERE token = :token AND expires_at > NOW()
        ");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $validToken = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if (!$validToken) {
            throw new \Exception('Invalid or expired token.');
        }
    
        // Check if the token is blacklisted
        $stmt = $this->pdo->prepare("
            SELECT * FROM blacklisted_tokens WHERE token = :token
        ");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $blacklisted = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($blacklisted) {
            throw new \Exception('Token is blacklisted.');
        }
    
        return ['message' => 'Token is valid.', 'user_id' => $validToken['user_id']];
    }

    // cleanup cron 
    public function cleanupExpiredTokens() {
        $stmt = $this->pdo->prepare("DELETE FROM tokens WHERE expires_at <= NOW()");
        $stmt->execute();
    }
    
    
}
