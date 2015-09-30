<?php
$servername = "www.changhuapeng.com";
$username = "volunteer";
$password = "iamaguest";
$dbname = "volunteer";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	 // prepare and bind
	$stmt = $conn->prepare("INSERT INTO VolunteerCFS (`Phone`, `Name`, `Email`, `Password`, `DOB`, `HaveCar`, `KnowCPR`) VALUES (?,?,?,?,?,?,?)");
	$stmt->bind_param("issssii", $phone, $name, $email, $password, $dob, $haveCar, $knowCPR);
	
	//get parameters
	$phone = $_GET['phone'];
	$name = $_GET['name'];
	$email = $_GET['email'];
	$password = $_GET['password'];
	$dob = $_GET['dob'];
	$haveCar= $_GET['haveCar'];
	$knowCPR = $_GET['knowCPR'];

	
	$passed = $stmt->execute();

	if($passed){
		$a = array("status" => array("Created successfully")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	} else {
		$a = array("status" => array("Contact number exists")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	}

	$stmt->close();
	$conn->close();

?>