<?php
if(!empty($_GET['activity_id']) && !empty($_GET['volunteer_id'])&& !empty($_GET['status']))
{	
	//get parameters
	$volunteer_id = $_GET['volunteer_id'];
	$activity_id = $_GET['activity_id'];
	$status= $_GET['status'];
	
	// Create connection
	$conn = pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");

	$result = pg_prepare($conn, "my_query", 'UPDATE tasks SET status=$1 WHERE volunteer_id=$2 and activity_id=$3');
	$passed = pg_execute($conn, "my_query", array($status, $volunteer_id, $activity_id));

	if($passed){
		$a = array("status" => array("Updated activity status.")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	} else {
		$a = array("status" => array("Error in sql statement")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	}
}

else{
	$a = array("status" => array("Missing parameter")); 
	$json_string = json_encode($a, JSON_PRETTY_PRINT);
	echo $json_string;
}
?>