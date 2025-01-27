<?php

// URL of the API endpoint
$apiUrl = 'http://localhost/notesapp/backend/api/v1/authentication/index.php?action=clean-expired-tokens';

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $apiUrl);    // Set the URL to call
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  // Return the response as a string
curl_setopt($ch, CURLOPT_TIMEOUT, 30);  // Set timeout (in seconds)
curl_setopt($ch, CURLOPT_POST, true);  // Specify that it's a POST request

// If the POST request requires data, you can pass it like this (example):
// If the API doesn't need additional data, you can skip the CURLOPT_POSTFIELDS option.
$postData = [
    'key' => 'value' // Add necessary POST data here
];
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData)); // This sends the POST data

// Execute cURL request and get the response
$response = curl_exec($ch);

// Check for errors
if ($response === false) {
    echo 'cURL Error: ' . curl_error($ch);
} else {
    echo 'API Response: ' . $response;
}

// Close cURL session
curl_close($ch);

?>
