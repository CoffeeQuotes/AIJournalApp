<?php

namespace NotesApp\System;

use PDO;
use PDOException;

class Database
{
    private static ?Database $instance = null; // Singleton instance
    private ?PDO $connection = null;          // PDO connection

    private string $host = '127.0.0.1';       // Database host
    private string $dbname = 'notesapp'; // Database name
    private string $username = 'root';        // Database username
    private string $password = 'root';            // Database password
    private string $charset = 'utf8mb4';      // Database charset

    // Private constructor to prevent direct instantiation
    private function __construct()
    {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
            $this->connection = new PDO($dsn, $this->username, $this->password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    // Get the Singleton instance of the database
    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // Get the PDO connection
    public function getConnection(): PDO
    {
        return $this->connection;
    }

    // Prevent cloning of the Singleton instance
    private function __clone()
    {
    }

    // Prevent unserializing of the Singleton instance
    private function __wakeup()
    {
    }
}
