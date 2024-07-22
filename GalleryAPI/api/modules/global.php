<?php 
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

class GlobalMethod{
    public function sendPayload($data,$remarks,$message,$code){
        $status = array("remarks"=>$remarks, "message"=>$message);
        http_response_code($code);
        return array(
            "status"=>$status,
            "payload"=>$data,
            "timestamp"=>date_create()
        );
    }
}

?>