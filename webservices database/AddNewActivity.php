<?php
$servername = "www.changhuapeng.com";
$username = "volunteer";
$password = "iamaguest";
$dbname = "laravel";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	 // prepare and bind
	$stmt = $conn->prepare("INSERT INTO tasks (`activity_id`, `volunteer_id`) VALUES (?,?)");
	$stmt->bind_param("ii", $activity_id, $volunteer_id);
	
	//get parameters
	$activity_id = $_GET['activity_id'];
	$volunteer_id = $_GET['volunteer_id'];
		
	$passed = $stmt->execute();

	if($passed){
		$a = array("status" => array("Application Successful")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	} else {
		$a = array("status" => array("Error")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	}

	$stmt->close();
	$conn->close();

?>