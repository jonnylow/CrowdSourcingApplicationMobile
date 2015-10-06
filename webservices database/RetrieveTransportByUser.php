<?php
//connect

if(!empty($_GET['id']) && !empty($_GET['type']))
{
	 $db = mysqli_connect("www.changhuapeng.com","volunteer","iamaguest"); 
	 if (!$db) {
	 die("Database connection failed miserably: " . mysql_error());
	 }

	 //select database
	 $db_select = mysqli_select_db($db,"laravel");
	 if (!$db_select) {
	 die("Database selection also failed miserably: " . mysql_error());
	 }

	$id = $_GET['id'];
	$type = $_GET['type'];
	//query
	if ($type == 1){
		$result = mysqli_query($db,"SELECT * FROM tasks where volunteer_id=$id and (approval='pending' or approval='approved') and status != 'completed'");
		if (!$result) {
	 	die("Database query failed: " . mysql_error());
	 	}
	} else {
		$result = mysqli_query($db,"SELECT * FROM tasks where volunteer_id=$id and approval!='pending'");
		if (!$result) {
	 	die("Database query failed: " . mysql_error());
	 	}
	}
	
	
	$array = array();

	while ($row = mysqli_fetch_array($result)) {
		$array[]= $row["activity_id"];
	}
	//print_r($array);

	$int = 0;
	$arrayTransport = array();
	
	//

	foreach($array as $transportID){
		//echo $transportID;
		
		//echo "SELECT * FROM Transport where transportID=".$transportID." and DateTimeStart > ".$datetime;
		$result = mysqli_query($db,"SELECT * FROM activities a, tasks t where a.activity_id=$transportID and a.activity_id=t.activity_id and volunteer_id=$id and datetime_start > now()");
		//printf("Error: %s.\n", $stmt->error);
		if (!$result) {
		die("Database query failed: " . mysql_error());
		}

		while ($row = mysqli_fetch_array($result)) {
			$array[$int] = array();
			$array[$int]['activity_id'] = $row[0];
			$array[$int]['name'] = $row[1];
			$array[$int]['location_from'] = $row[2];
			$array[$int]['location_from_long'] = $row[3];
			$array[$int]['location_from_lat'] = $row[4];
			$array[$int]['location_to'] = $row[5];
			$array[$int]['location_to_long'] = $row[6];
			$array[$int]['location_to_lat'] = $row[7];
			$array[$int]['datetime_start'] = $row[8];
			$array[$int]['expected_duration_minutes'] = $row[9];
			$array[$int]['more_information'] = $row[10];
			$array[$int]['elderly_name'] = $row[11];
			$array[$int]['next_of_kin_name'] = $row[12];
			$array[$int]['next_of_kin_contact'] = $row[13];
			$array[$int]['senior_centre_id'] = $row[14];
			$array[$int]['vwo_user_id'] = $row[15];
			$array[$int]['status'] = $row[21];
			$array[$int]['approval'] = $row[22];
			$int++;
	 	}
	}

	//Step5
	 mysqli_close($db);
	 
	 $json_string = json_encode($array, JSON_PRETTY_PRINT);
	 echo $json_string;
}
else
{
	$a = array("status" => array("Missing parameter")); 
	$json_string = json_encode($a, JSON_PRETTY_PRINT);
	echo $json_string;
}
?>