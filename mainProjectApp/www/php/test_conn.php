<?php
//https://stackoverflow.com/questions/4219970/warning-mysql-connect-2002-no-such-file-or-directory-trying-to-connect-vi

header('Access-Control-Allow-Origin: *');

//echo "alert(\"WORKS!\");";
 global $conn;


DEFINE('DB_USERNAME', 'root');
  DEFINE('DB_PASSWORD', 'chillins6');
  DEFINE('DB_HOST', '127.0.0.1');
  DEFINE('DB_DATABASE', 'cs476_Project');

  $conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

  if (mysqli_connect_error()) {
    die('Connect Error ('.mysqli_connect_errno().') '.mysqli_connect_error());
  }

 // echo 'Connected successfully.';

?>
