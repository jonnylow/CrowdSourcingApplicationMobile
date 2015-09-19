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
$result = mysqli_query($db,"SELECT * FROM volunteer");
 if (!$result) {
 die("Database query failed: " . mysql_error());
 }
 
 $int = 0;
$array = array();

 while ($row = mysqli_fetch_array($result)) {
	$array[$int] = array();
	$array[$int]['NRIC'] = $row[0];
	$array[$int]['FirstName'] = $row[1];
	$array[$int]['LastName'] = $row[2];
	$array[$int]['ContactNo'] = $row[3];
	$array[$int]['Address'] = $row[4];
	$array[$int]['Password'] = $row[5];
	$array[$int]['DateofBirth'] = $row[6];
	$array[$int]['Score'] = $row[7];
	$array[$int]['Photo'] = $row[8];
	$int++;
 }

//Step5
 mysqli_close($db);
 
 $json_string = json_encode($array, JSON_PRETTY_PRINT);
 echo $json_string;
?>