<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once("../connection.php");
mysqli_set_charset($conn, 'utf8');
$response = null;
$records  = null;
extract($_POST);
if (isset($_POST['productId']) && isset($_POST['productName']) && isset($_POST['unitId']) && isset($_POST['description']) && isset($_POST['salePrice']) && isset($_POST['Quantity'])) {
    $hsn          = isset($_POST['hsn']) ? $hsn : "NULL";
    $sku          = isset($_POST['sku']) ? $sku : "NULL";
    $categoryId   = isset($_POST['categoryId']) ? $categoryId : "NULL";
    $displayPrice = isset($_POST['displayPrice']) ? $displayPrice : "NULL";
    $taxId        = isset($_POST['taxId']) ? $taxId : "NULL";
    
    $productName = mysqli_real_escape_string($conn, $productName);
    $description = mysqli_real_escape_string($conn, $description);
    $salePrice   = mysqli_real_escape_string($conn, $salePrice);
    $Quantity    = mysqli_real_escape_string($conn, $Quantity);
    
    $query        = "UPDATE product_master pm INNER JOIN productdetails pd ON (pm.productId = pd.productId) 
    SET pm.productName = '$productName',pm.SKU='$sku',pm.HSN='$hsn',pm.unitId=$unitId,pm.categoryId=$categoryId,pm.description='$description',
    pd.TaxId = $taxId,pd.salePrice = '$salePrice',pd.displayPrice = '$displayPrice',pd.Quantity = '$Quantity'
    WHERE pm.productId = $productId";
    $jobQuery     = mysqli_query($conn, $query);
    $rowsAffected = mysqli_affected_rows($conn);
    if ($rowsAffected == 1) {
        $response = array(
            'Message' => "Products updated successfully",
            "Data" => $records,
            'Responsecode' => 200
        );
        
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