<?php
$servername = "www.changhuapeng.com";
$username = "volunteer";
$password = "iamaguest";
$dbname = "laravel";

if(!empty($_GET['activity_id']) && !empty($_GET['volunteer_id'])&& !empty($_GET['status']))
{	
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	 // prepare and bind
	$stmt = $conn->prepare("UPDATE tasks SET `status`=? WHERE `volunteer_id`=? and `activity_id`=?");
	$stmt->bind_param("sii", $status, $volunteer_id, $activity_id);

	
	//get parameters
	$volunteer_id = $_GET['volunteer_id'];
	$activity_id = $_GET['activity_id'];
	$status= $_GET['status'];
	
	$passed = $stmt->execute();

	if($passed){
		$a = array("status" => array("Updated activity status.")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	} else {
		$a = array("status" => array("Error in sql statement")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	}
	/*
	if ($stmt->errno) {
 echo "FAILURE!!! " . $stmt->error;
 }
 else echo "Updated {$stmt->affected_rows} rows";*/

	$stmt->close();
	$conn->close();
}

else{
	$a = array("status" => array("Missing parameter")); 
	$json_string = json_encode($a, JSON_PRETTY_PRINT);
	echo $json_string;
}
?>