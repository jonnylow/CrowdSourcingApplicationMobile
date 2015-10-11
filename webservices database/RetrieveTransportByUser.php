<?php
//connect

if(!empty($_GET['id']) && !empty($_GET['type']))
{
	 $db = pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");

	$id = $_GET['id'];
	$type = $_GET['type'];
	
	//query
	if ($type == 1){
		$result = pg_query($db,"SELECT * FROM tasks where volunteer_id=$id and (approval='pending' or approval='approved') and status != 'completed'");
		
		$array = array();

		while ($row = pg_fetch_array($result)) {
			$array[]= $row["activity_id"];
		}

		$int = 0;
		$arrayTransport = array();

		foreach($array as $transportID){
			$result = pg_query($db,"SELECT * FROM activities a, tasks t where a.activity_id=$transportID and a.activity_id=t.activity_id and volunteer_id=$id");
// and datetime_start > now()
			if (!$result) {
			die("Database query failed: " . mysql_error());
			}

			while ($row = pg_fetch_array($result)) {
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
		 
		 $json_string = json_encode($array, JSON_PRETTY_PRINT);
		 echo $json_string;
	} else {
		$result = pg_query($db,"SELECT * FROM tasks where volunteer_id=$id and approval!='pending'");
		
		$array = array();

		while ($row = pg_fetch_array($result)) {
			$array[]= $row["activity_id"];
		}

		$int = 0;
		$arrayTransport = array();

		foreach($array as $transportID){
			$result = pg_query($db,"SELECT * FROM activities a, tasks t where a.activity_id=$transportID and a.activity_id=t.activity_id and volunteer_id=$id");

			if (!$result) {
			die("Database query failed: " . mysql_error());
			}

			while ($row = pg_fetch_array($result)) {
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
		 
		 $json_string = json_encode($array, JSON_PRETTY_PRINT);
		 echo $json_string;
	}
}
else
{
	$a = array("status" => array("Missing parameter")); 
	$json_string = json_encode($a, JSON_PRETTY_PRINT);
	echo $json_string;
}
?>