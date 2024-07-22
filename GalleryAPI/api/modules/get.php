<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Include the Connection class
require_once "../config/database.php"; // Adjust the path as necessary

class Get {
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function getImage() {
        try {
            // Prepare SQL statement to fetch images
            $sql = "SELECT * FROM images";
            $stmt = $this->pdo->query($sql);
            
            // Fetch all rows as an associative array
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Return the fetched images data
            echo json_encode([
                "status" => "success",
                "message" => "Successfully retrieved images.",
                "data" => $result
            ]);
        } catch (PDOException $e) {
            // Handle any potential errors
            echo json_encode([
                "status" => "error",
                "message" => "Failed to retrieve images: " . $e->getMessage()
            ]);
        }
    }
}

// Create a PDO instance using the Connection class
$connection = new Connection();
$pdo = $connection->connect();

// Create an instance of the Get class and call the getImage method
$get = new Get($pdo);
$get->getImage();

?>
