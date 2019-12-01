<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once("../connection.php");
mysqli_set_charset($conn,'utf8');
$response=null;
$records=null;
extract($_POST);
if(isset($_POST['blogId']) && isset($_POST['blogTitle']) && isset($_POST['blogContent']) && isset($_POST['categoryId']) && isset($_POST['blogStatus']) && isset($_POST['blogUrl'])){
    
    $blogTitle = mysqli_real_escape_string($conn,$blogTitle);
    $blogContent =  mysqli_real_escape_string($conn,$blogContent);
    $blogUrl = mysqli_real_escape_string($conn,$blogUrl);
 
    $query = "UPDATE blogmaster SET blogTitle='$blogTitle',blogContent='$blogContent',categoryId=$categoryId,blogStatus='$blogStatus',blogUrl='$blogUrl' WHERE blogId = $blogId";
    $jobQuery = mysqli_query($conn,$query);
    $rowsAffected=mysqli_affected_rows($conn);
if($rowsAffected==1)
    {
        $response = array('Message'=>"Blogs updated successfully","Data"=>$records ,'Responsecode'=>200);
    
    }else{
        $response = array('Message'=>mysqli_error($conn).'Failed',"Data"=>$records ,'Responsecode'=>403);
    }
}else{
    $response = array('Message'=>"Parameter Missing" ,'Responsecode'=>500);  
}
mysqli_close($conn);
exit(json_encode($response));
?>