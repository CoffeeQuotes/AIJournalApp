<?php

require __DIR__ . '/../vendor/autoload.php'; // Load Composer's autoloader

use NotesApp\System\AppSettings; // Use the AppSettings class

$appSettings = new AppSettings(); // Instantiate the class
echo 'Class loaded successfully!';
