<?php

require_once "global.php";

class Signup extends GlobalMethod {
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function registerUser($email, $password) {
        try {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $sql = "INSERT INTO users (email, password) VALUES (?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$email, $hashedPassword]);
            return $this->sendPayload(null, 'success', 'User registered successfully', 200);
        } catch (PDOException $e) {
            return $this->sendPayload(null, 'error', 'Failed to register user: ' . $e->getMessage(), 500);
        }
    }
}

header("Content-Type: application/json");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->password)) {
    $signup = new Signup($pdo);
    echo $signup->registerUser($data->email, $data->password);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}
?>
