<?php
//connect
$db = pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");

$result = pg_query($db,"SELECT * FROM volunteers");

$int = 0;
$array = array();

 while ($row = pg_fetch_array($result)) {
	$array[$int] = array();
	$array[$int]['volunteer_id'] = $row[0];
	$array[$int]['nric'] = $row[1];
	$array[$int]['name'] = $row[2];
	$array[$int]['email'] = $row[3];
	$array[$int]['password'] = $row[4];
	$array[$int]['gender'] = $row[5];
	$array[$int]['date_of_birth'] = $row[6];
	$array[$int]['contact_no'] = $row[7];
	$array[$int]['occupation'] = $row[8];
	$array[$int]['has_car'] = $row[9];
	$array[$int]['area_of_preference_1'] = $row[11];
	$array[$int]['area_of_preference_2'] = $row[12];
	$array[$int]['is_approved'] = $row[15];
	
	$int++;

 }


//Step5
pg_close($db);
 
 $json_string = json_encode($array, JSON_PRETTY_PRINT);
 echo $json_string;
?>