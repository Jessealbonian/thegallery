<?php

require_once "global.php";

class Get extends GlobalMethod{
    private $pdo;
    public function __construct(\PDO $pdo){
        $this->pdo=$pdo;
    }
    
    public function getImage() {
        try {
            // Prepare SQL statement to fetch images
            $sql = "SELECT * FROM images";
            $stmt = $this->pdo->query($sql);
            
            // Fetch all rows as an associative array
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Return the fetched images data
            return [
                "status" => "success",
                "message" => "Successfully retrieved images.",
                "data" => $result
            ];
        } catch(PDOException $e) {
            // Handle any potential errors
            return [
                "status" => "error",
                "message" => "Failed to retrieve images: " . $e->getMessage()
            ];
        }
    }
}

