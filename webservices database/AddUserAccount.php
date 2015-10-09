<?php
	echo $hash;
	// Create connection
	$conn = pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");
	
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
	
	$hashPassword = md5($password);
	
	$result = pg_prepare($conn, "my_query", 'INSERT INTO volunteers (nric, name, email,password,gender,date_of_birth,contact_no,occupation,has_car,area_of_preference_1,area_of_preference_2,image_nric_front,image_nric_back) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)');
	$passed = pg_execute($conn, "my_query", array($nric, $name, $email, $hashPassword, $gender, $dateOfBirth, $contactNo, $occupation, $hasCar, $areaPreferences1, $areaPreferences2, $nricFront, $nricBack));
	
	if($passed){
		$a = array("status" => array("Created successfully")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	} else {
		$a = array("status" => array("error")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	}
?>