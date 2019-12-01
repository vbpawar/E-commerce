<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once("../connection.php");
mysqli_set_charset($conn, 'utf8');
$response = null;
$records  = null;
extract($_POST);
if (isset($_POST['blogTitle']) && isset($_POST['blogContent']) && isset($_POST['categoryId']) && isset($_POST['blogStatus']) && isset($_POST['blogUrl'])) {
    
    $blogTitle   = mysqli_real_escape_string($conn, $blogTitle);
    $blogContent = mysqli_real_escape_string($conn, $blogContent);
    $blogUrl     = mysqli_real_escape_string($conn, $blogUrl);
    
    $query    = "INSERT INTO blogmaster(blogTitle,blogContent,categoryId,blogStatus,blogUrl) VALUES('$blogTitle','$blogContent',$categoryId,$blogStatus,'$blogUrl')";
    $jobQuery = mysqli_query($conn, $query);
    if ($jobQuery == 1) {
        $last_id = mysqli_insert_id($conn);
        $s       = strval($last_id);
        
        $sql       = "SELECT * FROM blogmaster WHERE blogId = $s";
        $jobQuery1 = mysqli_query($conn, $sql);
        if ($jobQuery1 != null) {
            $academicAffected = mysqli_num_rows($jobQuery1);
            if ($academicAffected > 0) {
                $academicResults = mysqli_fetch_assoc($jobQuery1);
                $records[]       = $academicResults;
                $response        = array(
                    'Message' => "All Blogs Data fetched Successfully",
                    "Data" => $records,
                    'Responsecode' => 200
                );
            } else {
                $response = array(
                    'Message' => "Please Add data first",
                    "Data" => $records,
                    'Responsecode' => 300
                );
            }
        } else {
            $response = array(
                'Message' => "Refresh a page",
                "Data" => $records,
                'Responsecode' => 301
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