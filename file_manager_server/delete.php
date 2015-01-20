<?php
$output_dir = "../uploads/";
$op = (isset($_POST['op']) ? $_POST['op'] : NULL);

if(!is_null($op) && $op == "delete" && isset($_POST['files'])){
   
    $files = explode('|', $_POST['files']);
    foreach($files as $file){
        $filePath = $output_dir. $file;
        if (file_exists($filePath)){
            unlink($filePath);
        }
        echo "Deleted File ".$file."<br/>";
    }
}

?>