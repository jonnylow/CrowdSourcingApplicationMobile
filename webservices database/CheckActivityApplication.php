<?php
	$conn= pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");
	
	//get parameters
	$activity_id = $_GET['activity_id'];
	$volunteer_id = $_GET['volunteer_id'];
	$result = pg_query($conn,"SELECT * FROM tasks where activity_id =$activity_id and volunteer_id=$volunteer_id");
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