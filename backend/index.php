<?php
require_once 'System/requirement.php';

use NotesApp\System\AppSettings;

try {
    $appSettings = new AppSettings([
        'response_as_json' => true,
        'display_errors' => true,
    ]);

    $data = [
        'data' => [],
        'message' => 'Silence is Golden!',
        'status' => 200
    ];

    $appSettings->respond($data);
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
