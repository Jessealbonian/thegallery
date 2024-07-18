<?php

require_once "global.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405); // Method Not Allowed
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['imgName'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'failed', 'message' => 'Image name not provided']);
    exit();
}

$imgName = $data['imgName'];
$post = new Post($pdo); // Assuming $pdo is your database connection

$result = $post->deleteImage($imgName);

http_response_code($result['code']); // Set HTTP response code based on operation status
echo json_encode($result);
