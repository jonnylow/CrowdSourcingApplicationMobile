<?php
//connect

if(!empty($_GET['phone']))
{
	 $db = mysqli_connect("www.changhuapeng.com","volunteer","iamaguest"); 
	 if (!$db) {
	 die("Database connection failed miserably: " . mysql_error());
	 }

	 //select database
	 $db_select = mysqli_select_db($db,"volunteer");
	 if (!$db_select) {
	 die("Database selection also failed miserably: " . mysql_error());
	 }

	$phone = $_GET['phone'];
	//query
	$result = mysqli_query($db,"SELECT * FROM TaskCFS where phone=$phone");
	if (!$result) {
	 die("Database query failed: " . mysql_error());
	 }
	
	$array = array();

	while ($row = mysqli_fetch_array($result)) {
		$array[]= $row["TransportID"];
	}

	$int = 0;
	$arrayTransport = array();
	$datetime = new DateTime();
	date_format($datetime,"yyyy-mm-dd hh:mm:ss");
	//and DateTimeStart > $datetime 

	foreach($array as $transportID){
		$result = mysqli_query($db,"SELECT * FROM Transport where transportID=$transportID ");
		if (!$result) {
		die("Database query failed: " . mysql_error());
		}

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