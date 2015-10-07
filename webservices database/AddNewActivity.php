<?php
	$conn= pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");
	
	//get parameters
	$activity_id = $_GET['activity_id'];
	$volunteer_id = $_GET['volunteer_id'];
	$result = pg_prepare($conn, "my_query", 'INSERT INTO tasks (activity_id, volunteer_id) VALUES ($1,$2)');
	$passed = pg_execute($conn, "my_query", array($activity_id, $volunteer_id));

	if($passed){
		$a = array("status" => array("Application Successful")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	} else {
		$a = array("status" => array("Error")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	}
?>