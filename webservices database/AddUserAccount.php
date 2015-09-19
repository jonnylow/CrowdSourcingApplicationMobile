<?php
$servername = "www.changhuapeng.com";
$username = "volunteer";
$password = "iamaguest";
$dbname = "volunteer";

if(!empty($_GET['nric']) && !empty($_GET['firstname']) && !empty($_GET['lastname']) && !empty($_GET['contactnumber']) && !empty($_GET['address']) && !empty($_GET['password']) && !empty($_GET['dob']) && !empty($_GET['score']) && !empty($_GET['photo']))
{	
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	 // prepare and bind
	$stmt = $conn->prepare("INSERT INTO volunteer (`NRIC`, `First Name`, `Last Name`, `Contact No`, `Address`, `Password`, `Date of Birth`, `Score`, `Photo`) VALUES (?,?,?,?,?,?,?,?,?)");
	$stmt->bind_param("sssssssis", $nric, $firstname, $lastname, $contactno, $address, $password, $dob, $score, $photo);
	
	//get parameters
	$nric = $_GET['nric'];
	$firstname = $_GET['firstname'];
	$lastname = $_GET['lastname'];
	$contactno = $_GET['contactnumber'];
	$address = $_GET['address'];
	$password = $_GET['password'];
	$dob = $_GET['dob'];
	$score = $_GET['score'];
	$photo = $_GET['photo'];
	
	$passed = $stmt->execute();

	if($passed){
		$a = array("status" => array("Created successfully")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	} else {
		$a = array("status" => array("NRIC exists")); 
		$json_string = json_encode($a, JSON_PRETTY_PRINT);
		echo $json_string;
	}

	$stmt->close();
	$conn->close();
}

else{
	$a = array("status" => array("Missing parameter")); 
	$json_string = json_encode($a, JSON_PRETTY_PRINT);
	echo $json_string;
}
?>