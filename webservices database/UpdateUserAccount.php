<?php
if(!empty($_GET['id']) && !empty($_GET['password']))
{	
	//get parameters
	$id = $_GET['id'];
	$password = $_GET['password'];
	
	// Create connection
	$conn = pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");

	$result = pg_prepare($conn, "my_query", 'UPDATE volunteers SET password=$1 WHERE volunteer_id=$2');
	$passed = pg_execute($conn, "my_query", array($password, $id));

	if($passed){
		$a = array("status" => array("Change password successfully")); 
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