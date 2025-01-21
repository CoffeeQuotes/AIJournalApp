<?php 
namespace NotesApp\System;

class MoodAnalyzer {
    
    public function analyzeSentiment($text) 
    {
        $score = 0;

        // Simple Keyword-based sentiment scoring 
        $postiveWords = ['happy', 'joy', 'excited'];
        $negativeWords = ['sad', 'angry', 'frustrated'];

        foreach($postiveWords as $word) {
            if(stripos($text, $word) !== false) {
                $score += 10;
            }
        }

        foreach($negativeWords as $word) {
            if(stripos($text, $word) !== false) {
                $score -= 10;
            }
        }

        return $score;

    }

    public function mapScoreToMood($score) {
        if($score > 20) return 'happy';
        if($score > 0) return 'neutral';
        return 'sad';
    }
}