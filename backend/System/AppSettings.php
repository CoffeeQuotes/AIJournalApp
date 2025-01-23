<?php 
namespace NotesApp\System;

class AppSettings
{
    // Default settings
    private $settings = [
        'response_as_json' => true,
        'display_errors' => false,
    ];

    /**
     * Constructor to initialize settings
     * @param array $initialSettings
     */
    public function __construct(array $initialSettings = [])
    {
        $this->settings = array_merge($this->settings, $initialSettings);
        $this->applySettings();
    }

    /**
     * Set a specific setting
     * @param string $key
     * @param mixed $value
     */
    public function set(string $key, $value): void
    {
        if (array_key_exists($key, $this->settings)) {
            $this->settings[$key] = $value;
            $this->applySettings();
        } else {
            throw new InvalidArgumentException("Invalid setting key: $key");
        }
    }

    /**
     * Get a specific setting value
     * @param string $key
     * @return mixed
     */
    public function get(string $key)
    {
        if (array_key_exists($key, $this->settings)) {
            return $this->settings[$key];
        }
        throw new InvalidArgumentException("Setting key not found: $key");
    }

    /**
     * Apply settings (e.g., configure error reporting)
     */
    private function applySettings(): void
    {
        // Configure error reporting
        if ($this->settings['display_errors']) {
            ini_set('display_errors', '1');
            error_reporting(E_ALL);
        } else {
            ini_set('display_errors', '0');
            error_reporting(0);
        }
    }

    /**
     * Output a response
     * @param mixed $data
     */
    public function respond($data): void
    {
        if ($this->settings['response_as_json']) {
            $allowedOrigins = [
                'http://localhost:3000', // For development
                'https://yourfrontenddomain.com', // For production
            ];
            
            $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
            if (in_array($origin, $allowedOrigins)) {
                header("Access-Control-Allow-Origin: $origin");
            }
            header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
            header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
            
            // Handle preflight requests
            if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
                http_response_code(200);
                exit;
            }                
            header('Content-Type: application/json');
            echo json_encode($data);
        } else {
            if (is_array($data) || is_object($data)) {
                $data = print_r($data, true);
            }
            echo $data;
        }
    }
}
