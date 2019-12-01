<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include "../connection.php";
mysqli_set_charset($conn, 'utf8');
$response=null;
$records = null;
extract($_POST);
if (isset($_POST['Tax']) && isset($_POST['TaxId'])) {
    $sql = "UPDATE taxmaster SET Tax='$Tax' WHERE TaxId = $TaxId";
    $query = mysqli_query($conn,$sql);
					$rowsAffected=mysqli_affected_rows($conn);
						if($rowsAffected > 0)
						{
					  			$response = array('Message'=>"Tax updated successfully",'Responsecode'=>200);
						}
						else
						{
							$response=array("Message"=> mysqli_error($conn)."No data to change or user not present","Responsecode"=>500);
						}
}
else
{
		    $response = array('Message' => "Parameter missing", 'Responsecode' => 402);
}
mysqli_close($conn);
exit(json_encode($response));
?>
