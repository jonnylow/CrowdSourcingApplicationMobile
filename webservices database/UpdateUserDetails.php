<?php
if(!empty($_GET['id']) && !empty($_GET['name']) && !empty($_GET['number']) && !empty($_GET['occupation']) && !empty($_GET['p1']) && !empty($_GET['p2']) )
{	
	//get parameters
	$id = $_GET['id'];
	$name = $_GET['name'];
	$number = $_GET['number'];
	$occupation = $_GET['occupation'];
	$p1 = $_GET['p1'];
	$p2 = $_GET['p2'];

	
	// Create connection
	$conn = pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");

	$result = pg_prepare($conn, "my_query", 'UPDATE volunteers SET name=$1,contact_no=$2,occupation=$3,area_of_preference_1=$4,area_of_preference_2=$5 WHERE volunteer_id=$6');
	$passed = pg_execute($conn, "my_query", array($name,$number,$occupation,$p1,$p2,$id));

	if($passed){
		$a = array("status" => array("Update Success!")); 
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