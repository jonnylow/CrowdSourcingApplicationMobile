<?php
//connect
$db = pg_connect("host=changhuapeng.com dbname=volunteer user=volunteer password=iamaguest");

if(!empty($_GET['transportId']) && !empty($_GET['id']))
{	
	$transportId = $_GET['transportId'];
	$id= $_GET['id'];
	//query
	$result = pg_query($db,"SELECT * FROM activities a, tasks t, senior_centres s where a.activity_id =$transportId and t.volunteer_id =$id and a.activity_id=t.activity_id and s.senior_centre_id=a.senior_centre_id");
	 
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
		$array[$int]['status'] = $row[21];
		$array[$int]['approval'] = $row[22];
		$array[$int]['senior_centre_name'] = $row[24];
		$int++;

	 }
	 
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