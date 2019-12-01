<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once("../connection.php");
mysqli_set_charset($conn, 'utf8');
$response = null;
$records  = null;
extract($_POST);
if (isset($_POST['productName']) && isset($_POST['unitId']) && isset($_POST['description']) && isset($_POST['salePrice']) && isset($_POST['Quantity'])) {
    $hsn          = isset($_POST['hsn']) ? $hsn : "NULL";
    $sku          = isset($_POST['sku']) ? $sku : "NULL";
    $categoryId   = isset($_POST['categoryId']) ? $categoryId : "NULL";
    $displayPrice = isset($_POST['displayPrice']) ? $displayPrice : "NULL";
    $taxId        = isset($_POST['taxId']) ? $taxId : "NULL";
    
    $productName = mysqli_real_escape_string($conn, $productName);
    $description = mysqli_real_escape_string($conn, $description);
    $salePrice   = mysqli_real_escape_string($conn, $salePrice);
    $Quantity    = mysqli_real_escape_string($conn, $Quantity);
    
    $query    = "INSERT INTO product_master(productName,SKU,HSN,unitId,categoryId,description) VALUES('$productName','$sku','$hsn',$unitId,$categoryId,'$description')";
    $jobQuery = mysqli_query($conn, $query);
    if ($jobQuery == 1) {
        $last_id = mysqli_insert_id($conn);
        $s       = strval($last_id);
        $query2  = "INSERT INTO productdetails(productId,TaxId,salePrice,displayPrice,Quantity) VALUES('$s',$taxId,'$salePrice','$displayPrice','$Quantity')";
        if (mysqli_query($conn, $query2)) {
            
            $sql       = "SELECT * FROM product_master pm LEFT JOIN productdetails pd ON pm.productId = pd.productId WHERE pm.productId = $s";
            $jobQuery1 = mysqli_query($conn, $sql);
            if ($jobQuery1 != null) {
                $academicAffected = mysqli_num_rows($jobQuery1);
                if ($academicAffected > 0) {
                    $academicResults = mysqli_fetch_assoc($jobQuery1);
                    $records[]       = $academicResults;
                    $response        = array(
                        'Message' => "All Product Data fetched Successfully",
                        "Data" => $records,
                        'Responsecode' => 200
                    );
                } else {
                    $response = array(
                        'Message' => "Please Add data first",
                        "Data" => $records,
                        'Responsecode' => 200
                    );
                }
            } else {
                $response = array(
                    'Message' => "Refresh a page",
                    "Data" => $records,
                    'Responsecode' => 200
                );
            }
        } else {
            $response = array(
                'Message' => mysqli_error($conn),
                "Data" => $records,
                'Responsecode' => 200
            );
        }
    } else {
        $response = array(
            'Message' => mysqli_error($conn),
            "Data" => $records,
            'Responsecode' => 403
        );
    }
} else {
    $response = array(
        'Message' => "Parameter Missing",
        'Responsecode' => 500
    );
}
mysqli_close($conn);
exit(json_encode($response));
?>