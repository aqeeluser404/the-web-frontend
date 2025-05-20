<?php
// Define the base upload directory
$baseDir = __DIR__ . '/backend/server/uploads/';

// Get the requested file path (relative to uploads directory)
$requestedFile = $_GET['file'] ?? '';

// Security checks
if (empty($requestedFile) || 
    strpos($requestedFile, '..') !== false || 
    !preg_match('/^[a-zA-Z0-9_\-\.\/]+$/', $requestedFile)) {
    http_response_code(400);
    die('Invalid file request');
}

// Build full filesystem path
$filePath = $baseDir . $requestedFile;

// Check if file exists and is readable
if (file_exists($filePath) && is_readable($filePath)) {
    // Set appropriate headers
    $mimeType = mime_content_type($filePath);
    $fileSize = filesize($filePath);
    
    header('Content-Type: ' . $mimeType);
    header('Content-Length: ' . $fileSize);
    header('Cache-Control: public, max-age=604800'); // 1 week cache
    
    // For images, we can add some security headers
    if (strpos($mimeType, 'image/') === 0) {
        header('X-Content-Type-Options: nosniff');
        header('Content-Security-Policy: default-src \'self\'');
    }
    
    readfile($filePath);
} else {
    http_response_code(404);
    header('Content-Type: text/plain');
    echo 'File not found';
}