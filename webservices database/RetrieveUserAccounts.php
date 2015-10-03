<?php
//connect
 $db = mysqli_connect("www.changhuapeng.com","volunteer","iamaguest"); 
 if (!$db) {
 die("Database connection failed miserably: " . mysql_error());
 }

 //select database
 $db_select = mysqli_select_db($db,"volunteer");
 if (!$db_select) {
 die("Database selection also failed miserably: " . mysql_error());
 }

 
//query
$result = mysqli_query($db,"SELECT * FROM VolunteerCFS");
 if (!$result) {
 die("Database query failed: " . mysql_error());
 }
 
 $int = 0;
$array = array();

 while ($row = mysqli_fetch_array($result)) {
	$array[$int] = array();
	$array[$int]['Phone'] = $row[0];
	$array[$int]['Name'] = $row[1];
	$array[$int]['Email'] = $row[2];
	$array[$int]['Password'] = $row[3];
	$array[$int]['DOB'] = $row[4];
	$array[$int]['HaveCar'] = $row[5];
	$array[$int]['KnowCPR'] = $row[6];
	$array[$int]['accountApproved'] = $row[7];
	$int++;

 }


//Step5
 mysqli_close($db);
 
 $json_string = json_encode($array, JSON_PRETTY_PRINT);
 echo $json_string;
?>