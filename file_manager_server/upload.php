<?php
$output_dir = "../uploads/";
if(isset($_FILES["myfile"]))
{
	$ret = array();

	$error =$_FILES["myfile"]["error"];
	//You need to handle  both cases
	//If Any browser does not support serializing of multiple files using FormData()
    chmod($output_dir, 0755);
	
    if(is_writable($output_dir))
    {
        if(!is_array($_FILES["myfile"]["name"])) //single file
        {
            $fileName = $_FILES["myfile"]["name"];
            if(move_uploaded_file($_FILES["myfile"]["tmp_name"],$output_dir.$fileName)){
                $ret[]= $fileName;
            }
            else {
                $ret[] = "error moving files";
            }


        }
        else  //Multiple files, file[]
        {
          $fileCount = count($_FILES["myfile"]["name"]);
          for($i=0; $i < $fileCount; $i++)
          {
            $fileName = $_FILES["myfile"]["name"][$i];
            move_uploaded_file($_FILES["myfile"]["tmp_name"][$i],$output_dir.$fileName);
            $ret[]= $fileName;
          }

        }
    }
    else
    {
        header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(array('message' => 'ERROR no writing permission', 'code' => 1337)));
        $ret[] = "output directory not writable";
    }
    echo json_encode($ret);
 }
 ?>
