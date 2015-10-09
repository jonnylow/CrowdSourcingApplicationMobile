<?php
	$conn= pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");
	
	//get parameters
	$nric = $_GET['nric'];
	$result = pg_query($conn,"SELECT * FROM volunteers where nric='$nric'");
	$row = pg_fetch_array($result);
	
	if($row[0] == null)
	{
		$a = array("status" => array("do not exist")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	}
	else
	{
		$a = array("status" => array("exist")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	}


?>