<?php
require_once "global.php";

class Post extends GlobalMethod {
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function addImage($file) {
        $code = 0;
        $errmsg = "";

        // File upload logic
        $targetDir = "uploads/";
        
        // Check if the directory exists, if not create it
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $targetFile = $targetDir . basename($file["name"]);
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
        $allowedTypes = array("jpg", "png", "jpeg", "gif");

        if (in_array($imageFileType, $allowedTypes)) {
            if (move_uploaded_file($file["tmp_name"], $targetFile)) {
                $sql = "INSERT INTO images (imgName, img) VALUES (?, ?)";
                try {
                    $stmt = $this->pdo->prepare($sql);
                    $stmt->execute([
                        $file["name"],
                        $targetFile
                    ]);
                    return $this->sendPayload(null, 'success', 'Successfully inserted image', 200);
                } catch (\PDOException $e) {
                    return $this->sendPayload(null, 'failed', $e->getMessage(), 500);
                }
            } else {
                $errmsg = "Failed to move uploaded file.";
                return $this->sendPayload(null, 'failed', $errmsg, 500);
            }
        } else {
            $errmsg = "Unsupported file type.";
            return $this->sendPayload(null, 'failed', $errmsg, 400);
        }
    }

    public function deleteImage($imgName) {
        $sql = "DELETE FROM images WHERE imgName = ?";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$imgName]);
            return $this->sendPayload(null, 'success', 'Image deleted successfully', 200);
        } catch (\PDOException $e) {
            return $this->sendPayload(null, 'failed', $e->getMessage(), 500);
        }
    }
}

?>
