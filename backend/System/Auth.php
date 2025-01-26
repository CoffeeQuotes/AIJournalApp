<?php
namespace NotesApp\System;

use PDO;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as EmailException;

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
        $stmt = $this->pdo->prepare("
            SELECT * FROM tokens 
            WHERE token = :token AND expires_at > NOW()
        ");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $currentToken = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if (!$currentToken) {
            throw new \Exception('Token not found or expired.', 401);
        }
    
        $newToken = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));
    
        $stmt = $this->pdo->prepare("
            UPDATE tokens 
            SET token = :new_token, expires_at = :expires_at 
            WHERE id = :id
        ");
        $stmt->bindParam(':new_token', $newToken);
        $stmt->bindParam(':expires_at', $expiresAt);
        $stmt->bindParam(':id', $currentToken['id']);
        $stmt->execute();
    
        return ['token' => $newToken, 'expires_at' => $expiresAt];
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
            $mail = new PHPMailer(true);

            try {
                $mail->isSMTP();
                $mail->Host = '127.0.0.1';
                $mail->Port = 1025;
                $mail->SMTPAuth = false;
                $mail->SMTPDebug = false;

                $mail->setFrom('message@notesapp.com', 'NotesApp');
                $mail->addAddress($email);

                $mail->isHTML(true);
                $mail->Subject = 'Password Reset';
                $mail->Body = '
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            background-color: #ffffff;
                            border-radius: 5px;
                            padding: 20px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                            max-width: 600px;
                            margin: auto;
                        }
                        h1 {
                            color: #333;
                        }
                        p {
                            color: #555;
                        }
                        .reset-link {
                            display: inline-block;
                            padding: 10px 15px;
                            margin: 20px 0;
                            background-color: #007bff;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        }
                        .reset-link:hover {
                            background-color: #0056b3;
                        }
                        footer {
                            margin-top: 20px;
                            font-size: 12px;
                            color: #aaa;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>NotesApp | AI Journaling app!</h1>
                        <h3>Password Reset Request</h3>
                        <p>Please click the button below to reset your password:</p>
                        <a href="http://localhost:3000/reset-password/' . $token . '" class="reset-link">Reset Password</a>
                        <footer>
                            <p>If you did not request a password reset, please ignore this email.</p>
                        </footer>
                    </div>
                </body>
                </html>';

                $mail->send();

            } catch (EmailException $e) {
                echo 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
            }
            // ...We have to send an email here to the user

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
