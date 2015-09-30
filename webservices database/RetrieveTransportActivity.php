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
$result = mysqli_query($db,"SELECT * FROM Transport");
 if (!$result) {
 die("Database query failed: " . mysql_error());
 }
 
 $int = 0;
$array = array();

 while ($row = mysqli_fetch_array($result)) {
	$array[$int] = array();
	$array[$int]['TransportID'] = $row[0];
	$array[$int]['ActivityName'] = $row[1];
	$array[$int]['LocationFrom'] = $row[2];
	$array[$int]['LocationFromLong'] = $row[3];
	$array[$int]['LocationFromLat'] = $row[4];
	$array[$int]['LocationTo'] = $row[5];
	$array[$int]['LocationToLong'] = $row[6];
	$array[$int]['LocationToLat'] = $row[7];
	$array[$int]['DateTimeStart'] = $row[8];
	$array[$int]['ExpectedDuration'] = $row[9];
	$array[$int]['ElderlyName'] = $row[10];
	$array[$int]['NextofKinName'] = $row[11];
	$array[$int]['NextofKinContact'] = $row[12];
	$array[$int]['MoreInformation'] = $row[13];
	$array[$int]['NeedCar'] = $row[14];
	$array[$int]['NeedCPR'] = $row[15];
	$array[$int]['SeniorCenterID'] = $row[16];
	$int++;

 }


//Step5
 mysqli_close($db);
 
 $json_string = json_encode($array, JSON_PRETTY_PRINT);
 echo $json_string;
?>