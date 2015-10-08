<?php
//connect
 $db = pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");

//query
$result = pg_query($db,"SELECT * FROM activities where datetime_start > now() and activity_id not in(SELECT activity_id FROM tasks where approval='approved')");

 $int = 0;
$array = array();

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
	$int++;

 }
 
 $json_string = json_encode($array, JSON_PRETTY_PRINT);
 echo $json_string;
?>