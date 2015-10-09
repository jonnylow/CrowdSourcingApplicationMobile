<?php
	$conn= pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");
	
	//get parameters
	$email = $_GET['email'];
	$password = $_GET['password'];
	$result = pg_query($conn,"SELECT password FROM volunteers where email='$email'");
	$row = pg_fetch_array($result);
	
	if($row[0] == null)
	{
		$a = array("status" => array("false")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	}
	else
	{
		$hashPassword = md5($password);
		if($row[0] == $hashPassword)
		{
			$a = array("status" => array("true")); 
			$json_string = json_encode($a, JSON_PRETTY_PRINT);
			echo $json_string;
		}
		else
		{
			$a = array("status" => array("false")); 
			$json_string = json_encode($a, JSON_PRETTY_PRINT);
			echo $json_string;
		}
	}


?>