<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include "../connection.php";
mysqli_set_charset($conn, 'utf8');
$response      = null;
$records       = null;
$transactionId = null;
extract($_POST);

if (isset($_POST['postdata'])) {
    $someArray            = json_decode($postdata, true);
    $type                 = $someArray['t_type'];
    $userId               = $someArray["userId"];
    $invDate              = $someArray["invDate"];
    $discount             = $someArray["discount"];
    $remark               = $someArray["remark"];
    $transaction_products = $someArray["products"];
    $sql                  = "INSERT INTO transaction_master(t_type, userId,invDate,discount,remark) VALUES ('$type','$userId','$invDate','$discount','$remark')";
    $query                = mysqli_query($conn, $sql);
    if ($query == 1) {
        $last_id = mysqli_insert_id($conn);
        $tId     = strval($last_id);
        foreach ($transaction_products as $key => $value) {
            $productid    = $transaction_products[$key]['productId'];
            $taxid        = $transaction_products[$key]['taxid'];
            $quantity     = $transaction_products[$key]['quantity'];
            $rate         = $transaction_products[$key]['rate'];
            $description  = $transaction_products[$key]['description'];
            $query        = mysqli_query($conn, "INSERT INTO transaction_details(transaction_id, productId,taxId,Quantity,rate,t_description) values ($tId,$productid,$taxid,$quantity,$rate,'$description')");
            $rowsAffected = mysqli_affected_rows($conn);
            if ($rowsAffected == 1) {
                $response = array(
                    'Message' => "Transaction saved successfully",
                    "Data" => $records,
                    'Responsecode' => 200
                );
            } else {
                $response = array(
                    'Message' => mysqli_error($conn) . "Message failed",
                    'Responsecode' => 403
                );
            }
        }
    } else {
        $response = array(
            "Message" => mysqli_error($conn) . "Message failed",
            "query" => $sql,
            "Responsecode" => 404
        );
    }
    
} else {
    $response = array(
        "Message" => "Parameters missing",
        "Responsecode" => 403
    );
}
mysqli_close($conn);
print json_encode($response);
?> 