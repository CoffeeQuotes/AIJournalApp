<?php 
namespace NotesApp\System;

class MoodAnalyzer {
    
    
    private $microserviceUrl;

    public function __construct() {
        $this->microserviceUrl = 'http://localhost:5000/analyze'; // Update with your Python microservice URL
    }

    public function analyzeSentiment($text) {
        $payload = ['text' => $text];
        $ch = curl_init($this->microserviceUrl);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $result = json_decode($response, true);
            if (isset($result['sentiment']) && isset($result['score'])) {
                return [
                    'sentiment' => $result['sentiment'],
                    'score' => $result['score'],
                ];
            } else {
                throw new \Exception("Unexpected response format from sentiment analysis service.");
            }
        } else {
            throw new \Exception("Error analyzing sentiment. HTTP Code: $httpCode");
        }
    }
        
}