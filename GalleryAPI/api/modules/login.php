<?php

require_once "global.php";

class Login extends GlobalMethod {
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function authenticateUser($email, $password) {
        try {
            $sql = "SELECT id, password FROM users WHERE email = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                return $this->sendPayload(['userId' => $user['id']], 'success', 'Login successful', 200);
            } else {
                return $this->sendPayload(null, 'error', 'Invalid email or password', 401);
            }
        } catch (PDOException $e) {
            return $this->sendPayload(null, 'error', 'Failed to authenticate user: ' . $e->getMessage(), 500);
        }
    }
}

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->password)) {
    $login = new Login($pdo);
    echo $login->authenticateUser($data->email, $data->password);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}
?>
