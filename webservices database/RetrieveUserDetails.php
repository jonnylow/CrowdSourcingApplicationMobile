<?php
//connect
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
//query
$result = mysqli_query($db,"SELECT * FROM volunteers where volunteer_id=$id");
 if (!$result) {
 die("Database query failed: " . mysql_error());
 }
 
 $int = 0;
$array = array();

 while ($row = mysqli_fetch_array($result)) {
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
	
	$int++;

 }


//Step5
 mysqli_close($db);
 
 $json_string = json_encode($array, JSON_PRETTY_PRINT);
 echo $json_string;
?>