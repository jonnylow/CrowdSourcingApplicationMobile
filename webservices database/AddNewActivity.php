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
	$stmt = $conn->prepare("INSERT INTO TaskCFS (`Phone`, `TransportID`, `RegisterDateTime`) VALUES (?,?,?)");
	$stmt->bind_param("iis", $phone, $transportID, $registerDateTime);
	
	//get parameters
	$phone = $_GET['phone'];
	$transportID = $_GET['transportID'];
	$registerDateTime = $_GET['registerDateTime'];
		
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