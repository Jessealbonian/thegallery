<?php

 require_once "global.php";

class Post extends GlobalMethod{
    private $pdo;
    private $get;
    public function __construct(\PDO $pdo){
        $this->pdo=$pdo;

        $this->get = new Get($pdo);
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
                    return $this->sendPayload(null, 'success', 'Successfully inserted image', $code);
                } catch (\PDOException $e) {
                    return $e->getMessage();
                    $code = 400;
                }
            } else {
                $errmsg = "Failed to move uploaded file.";
                $code = 500;
            }
        } else {
            $errmsg = "Unsupported file type.";
            $code = 400;
        }

        return $this->sendPayload(null, 'failed', $errmsg, $code);
    }
}
