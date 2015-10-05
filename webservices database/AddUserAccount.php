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
	$stmt = $conn->prepare("INSERT INTO volunteers (`nric`,`name`,`email`,`password`,`gender`,`date_of_birth`,`contact_no`,`occupation`,`has_car`,`area_of_preference_1`,`area_of_preference_2`,`image_nric_front`,`image_nric_back`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
	$stmt->bind_param("sssssssssssss", $nric, $name, $email, $password, $gender, $dateOfBirth, $contactNo, $occupation, $hasCar, $areaPreferences1, $areaPreferences2, $nricFront, $nricBack);
	
	//get parameters
	$nric = $_GET['nric'];
	$name = $_GET['name'];
	$email = $_GET['email'];
	$password = $_GET['password'];
	$gender = $_GET['gender'];
	$dateOfBirth= $_GET['dob'];
	$contactNo = $_GET['phone'];
	$occupation= $_GET['occupation'];
	$hasCar= $_GET['haveCar'];
	$areaPreferences1= $_GET['preferences1'];
	$areaPreferences2= $_GET['preferences2'];
	$nricFront= $_GET['frontIC'];
	$nricBack= $_GET['backIC'];
	
	$passed = $stmt->execute();
	
	if($passed){
		$a = array("status" => array("Created successfully")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	} else {
		$a = array("status" => array("error")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	}

	$stmt->close();
	$conn->close();

?>