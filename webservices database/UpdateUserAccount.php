<?php
$servername = "www.changhuapeng.com";
$username = "volunteer";
$password = "iamaguest";
$dbname = "laravel";

if(!empty($_GET['id']) && !empty($_GET['password']))
{	
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	 // prepare and bind
	$stmt = $conn->prepare("UPDATE volunteers SET `password`=? WHERE `volunteer_id`=?");
	$stmt->bind_param("si", $password, $id);
	
	//get parameters
	$id = $_GET['id'];
	$password = $_GET['password'];
	
	$passed = $stmt->execute();

	if($passed){
		$a = array("status" => array("Change password successfully")); 
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