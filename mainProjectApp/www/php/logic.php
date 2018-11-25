<?php 

header('Access-Control-Allow-Origin: *');

session_start();

require 'test_conn.php';


 //global $conn;

if(isset($_REQUEST["signUp"]) && $_REQUEST["signUp"]=="yes")
{
	signUp($conn);
}

if(isset($_REQUEST["signOut"]) && $_REQUEST["signOut"]=="yes")
{
	signOut($conn);
}

if(isset($_REQUEST['login']) &&  $_REQUEST['login']=="yes")
{
	login($conn);
}

if(isset($_REQUEST["sellBook"]) && $_REQUEST["sellBook"]=="yes")
{
	sellABook($conn);
}
if(isset($_REQUEST["displayAllBooks"]) && $_REQUEST["displayAllBooks"]=="yes")
{
	DisplayAllBooks($conn);
}

if(isset($_REQUEST["displayBookDetail"]) && $_REQUEST["displayBookDetail"]=="yes")
{
	DisplayBookDetail($conn);
}

if(isset($_REQUEST["emailSeller"]) && $_REQUEST["emailSeller"]=="yes")
{
	emailBookSeller($conn);
}
if(isset($_REQUEST["addWishlist"]) && $_REQUEST["addWishlist"]=="yes")
{
	addBookToWishList($conn);
}

if(isset($_REQUEST["editUserPostedBooks"]) && $_REQUEST["editUserPostedBooks"]=="yes")
{
    
	editUserPostedBooksAction($conn, $sql);
}


if(isset($_REQUEST["deleteWishlist"]) && $_REQUEST["deleteWishlist"]=="yes")
{
	deleteBookFromWishList($conn);
}


if(isset($_REQUEST["displayWishlistBooks"]) && $_REQUEST["displayWishlistBooks"]=="yes")
{
	showUserWishList($conn);
}

if(isset($_REQUEST["randomBooks"]) && $_REQUEST["randomBooks"]=="yes")
{
	showRandThreeBooksOnSale($conn);
}

if(isset($_REQUEST["displayUserPostedBooks"]) && $_REQUEST["displayUserPostedBooks"]=="yes")
{
	displayUserPostedBooks($conn);
}

if(isset($_REQUEST["displayAllDeptBooks"]) && $_REQUEST["displayAllDeptBooks"]=="yes")
{
    $subjt=$_REQUEST["subjectName"];
    $currentLoc=$_REQUEST['location'];
    $subjtID=getBookSubjectID($conn, $subjt);
	displayAllDeptBooks($conn, $subjtID, $currentLoc);
}

/*function signUp($conn){
$sql = "SELECT * FROM Subjects";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["subject_ID"]. " - Name: " . $row["subjectName"]. " <br>";
    }
} else {
    echo "0 results";
}
}*/

function sendEmail($email_to, $email_bdy, $email_sbj, $email_reply, $option, $conn){
    require 'PHPMailer/PHPMailerAutoload.php';

    $mail= new PHPMailer();
    $mail->Host='smtp.gmail.com';
     $mail->SMTPDebug = 0;    
    $mail->isSMTP(); 
    $mail->SMTPAuth=true;
    $mail->Username='skoobcs476@gmail.com';
    $mail->Password='samira476';
    $mail->SMTPSecure='tls';
    $mail->Port=587;

    $mail->setFrom('skoobscs476@gmail.com','skoobscs476@gmail.com'); //not changes

    $mail->addAddress($email_to);
    $mail->addReplyTo($email_reply); //not changes

    $mail->Subject=$email_sbj;
    $mail->Body=$email_bdy;

    if($option == "once"){
        $mail->send();
    }
        if($option == "multiple")
        {
          //echo'mail sending fail'. $mail->ErrorInfo;
            //echo"mail sent";


        $sql2="select email from Users where notifications = 'yes'";

        $p_address=$conn->query($sql2);
        while ($rowEmail = mysqli_fetch_assoc($p_address))
        {
            $mail->AddAddress($rowEmail["email"]);
           $mail->send();
           $mail->ClearAllRecipients();     
        }
       }
   
}

function signUp($conn){
    $warn="";
	$errmsg = "no";
   
   //here getting result from the post array after submitting the form.
    $user_email=mysqli_real_escape_string($conn,$_POST['email'] );
    $user_password=mysqli_real_escape_string($conn,$_POST['password']);//same
	$user_loc=mysqli_real_escape_string($conn,$_POST['userLoc']);//same
	$user_notify=mysqli_real_escape_string($conn,$_POST['notifyOption']);//same
  
    
    
   $sql1="SELECT * FROM Users WHERE email='$user_email' LIMIT 1";
   $result = $conn->query($sql1);
   //$result= mysqli_query($conn,$sql1);

	if(mysqli_fetch_array($result) != 0){
		$warn = 'Email already exist in the system';
	    $errmsg = "yes";
	}
	else{
        $sql2="INSERT INTO Users (email,password,city,notifications) VALUE ('$user_email','$user_password','$user_loc','$user_notify');";    
		$chek=$conn->query($sql2);
        
        sendEmail($user_email, "welcome to skoobs.\n\n pls do not reply this email", 'confirmation email', 'skoobscs476@gmail.com',"once",$conn);
        
		//echo $chek;
		if($chek){
            
           // sendEmail($user_email, 'welcome to skoobs.%0A pls do not reply this email', 'confirmation email');
            
			$warn = "You have Successfully signed up";
			}
			else
				$warn = 'sql error';
   }
    
    $sResp[] =  array("errmsg" => $errmsg, "msg" => $warn );
		echo json_encode($sResp);
}


function login($conn){
    
    $warn="";
	$errmsg = "no";
    
     $user_email=mysqli_real_escape_string($conn,$_POST['email'] );
    $user_password=mysqli_real_escape_string($conn,$_POST['password']);//same
    
    $sql="SELECT * from Users WHERE email ='$user_email'AND password='$user_password'";
    $result=$conn->query($sql);
    $checkUser=mysqli_num_rows($result);
	
		if($checkUser > 0){
			$row=mysqli_fetch_assoc($result);
					
				$_SESSION['USERNAME']=$row['email'];
				//$_SESSION['location']=$_POST['userLoc'];
				$_SESSION['ID']=$row['user_ID'];
               $sRow["userEmail"]=$row["email"];
               $sResp[] = $sRow;
				$warn = "You have Successfully logged in";
			}
			else
			{
                $warn = "please enter correct user details";
                $errmsg = "yes";
			}
    
         $sResp[] =  array("errmsg" => $errmsg, "msg" => $warn );
    
    echo json_encode($sResp);
	
}

function getBookDepartmentID($conn, $dName){
    $sql="select * from Departments where departmentName like '%$dName%'";
    $result=$conn->query($sql);
    $row=mysqli_fetch_assoc($result);
    $tempID=$row['department_ID'];
    $id=intval($tempID);
    
    return $id;
}

function getBookSubjectID($conn, $sName){
    $sql="select * from Subjects where subjectName like '%$sName%'"; 
    $result=$conn->query($sql);
    $row=mysqli_fetch_assoc($result);
    $tempID=$row['subject_ID'];
    $id=intval($tempID);
    
    return $id;
}


function getTodayDate($conn){
    $sql="SELECT  CURRENT_DATE AS currentDateTime";
    $result=$conn->query($sql);
    $row=mysqli_fetch_assoc($result);
    $mDate=$row['currentDateTime'];
    
    return $mDate;
}

function sellABook($conn){
    
   $BookPic_filePath="";
    
  //-----start uploading Photo   ---------////  
  if(isset($_REQUEST["photoCam"]) && $_REQUEST["photoCam"]=="yes")
{
	 $file = 'upload/'. time() . '.png'; 
  
#from ajax post request save the post variable to $img
$img = $_REQUEST['image'];
    
#replace empty space
$img = str_replace(' ', '+', $img); 

#base64 decode
$data = base64_decode($img);

#save the file      
 $success = file_put_contents($file,$data);

/*if($success)
    echo "upload successfully";
else
    echo "an error occours while saving file";*/

  $BookPic_filePath = $file;
}  
  
if(isset($_REQUEST["photoGalla"]) && $_REQUEST["photoGalla"]=="yes")
{
    $imgName = str_replace('%', '_', $_FILES["file"]["name"]);
    //$imgName =$_FILES["file"]["name"];
    $dir = 'upload/'.$imgName;
    
	move_uploaded_file($_FILES["file"]["tmp_name"], $dir);
    
    $BookPic_filePath = $dir;
}
//-------end uploading Photo -----------------//
    
  $bname=mysqli_real_escape_string($conn,$_POST['bookName'] );
    $notes=mysqli_real_escape_string($conn,$_POST['notes'] );
    
    $temp_isbn=mysqli_real_escape_string($conn,$_POST['isbn_NUM']);
    $isbn=intval($temp_isbn);
    
    $temp_price=mysqli_real_escape_string($conn,$_POST['price'] );
    $price=floatval($temp_price);
    
    //$date= date("Y/m/d");
    $date=getTodayDate($conn);
    $sbjt_ID=getBookSubjectID($conn, $_POST['subject']);
    $dprt_ID=getBookDepartmentID($conn,$_POST['department']);
    $sellerID=$_SESSION['ID'];
   
    $sql="INSERT INTO BooksOnSale (image,bookName,price,departmentID,subjectID,sellerID,bookStatusID,uploadDate,ISBN_number,additionalNotes) VALUE ('$BookPic_filePath','$bname', $price , $dprt_ID , $sbjt_ID ,$sellerID, 1 , '$date', $isbn ,'$notes')";
    
$result=$conn->query($sql);
    if($result){
        echo"submitted";
    }
    else{
        echo("Error description: " . mysqli_error($conn));
    }
    
    $emailBody="please do not reply this email\n\n Someone Posted a Book. please Loggin to check it out";
    $emailsubject="SKOOB notification email";
    
    sendEmail('', $emailBody, 'notification email', $emailsubject, "multiple",$conn);

}

function DisplayAllBooks($conn){
    
    $currentLoc=$_REQUEST['location'];
    $temp_isbnSearchKey=$_REQUEST['displayAllBooksByISBN'];
    $sbNameSearchKey=$_REQUEST['displayAllBooksBysnameORbname'];
    $sql="";
     $strJSON = "";
		$strErr = "";
    
    if($temp_isbnSearchKey != ""){
        $isbnSearchKey=intval($temp_isbnSearchKey);
        $sql="select BooksOnSale.*,departmentName,subjectName,statusName,city from BooksOnSale left join Departments on (BooksOnSale.departmentID = Departments.department_ID) left join Subjects on (BooksOnSale.subjectID = Subjects.subject_ID) left join BookStatus on(BooksOnSale.bookStatusID = BookStatus.status_ID ) left join Users on(BooksOnSale.sellerID = Users.user_ID) where BooksOnSale.ISBN_number = $isbnSearchKey order by case when Users.city = '$currentLoc' then 1 else 2 end, Users.city";
    }
    else if($sbNameSearchKey != ""){
        
        $sql="select BooksOnSale.*,departmentName,subjectName,statusName,city from BooksOnSale left join Departments on (BooksOnSale.departmentID = Departments.department_ID) left join Subjects on (BooksOnSale.subjectID = Subjects.subject_ID) left join BookStatus on(BooksOnSale.bookStatusID = BookStatus.status_ID ) left join Users on(BooksOnSale.sellerID = Users.user_ID)
        where Departments.departmentName like '%$sbNameSearchKey%' or Subjects.subjectName like '%$sbNameSearchKey%' or BooksOnSale.bookName like '%$sbNameSearchKey%' order by case when Users.city = '$currentLoc' then 1 else 2 end, Users.city";
        
    }
    else{
    $sql="select BooksOnSale.*,departmentName,subjectName,statusName,city from BooksOnSale left join Departments on (BooksOnSale.departmentID = Departments.department_ID) left join Subjects on (BooksOnSale.subjectID = Subjects.subject_ID) left join BookStatus on(BooksOnSale.bookStatusID = BookStatus.status_ID ) left join Users on(BooksOnSale.sellerID = Users.user_ID) order by case when Users.city = '$currentLoc' then 1 else 2 end, Users.city";
    }
    
    $result=$conn->query($sql);
    
    if (mysqli_num_rows($result)==0){
		//$strErr = '{"errmsg" : "'. $sql . ' ' . 'There is no matching record found."}';
		$strErr = '{"errmsg" : "There is no matching record found."}';
		$strJSON = "[". $strErr ."]";
		echo $strJSON;
		}
		else
		{
		$sResp[] =  array("errmsg" => $errmsg, "sql" => $sql);
		while ($row = mysqli_fetch_assoc($result))
		{
		$sRow["bID"]=$row["book_ID"];
			$sRow["bname"]=$row["bookName"];
				$sRow["sname"]=$row["subjectName"];
		$sRow["imgSrc"]=$row["image"];
			$sRow["notes"]=$row["additionalNotes"];
				$sRow["price"]=$row["price"];
				$sResp[] = $sRow;
       }
            
            
		
	
	
	
				}
   // $sJSON = rJSONBooks($sql,$result);
	//echo $sJSON;
    echo json_encode($sResp);
}

/*function rJSONBooks($sql,$result){
    
    $strJSON = "";
		$strErr = "";
	
		if (mysqli_num_rows($result)==0){
		//$strErr = '{"errmsg" : "'. $sql . ' ' . 'There is no matching record found."}';
		$strErr = '{"errmsg" : "There is no matching record found."}';
		$strJSON = "[". $strErr ."]";
		echo $strJSON;
		}
		else
		{
		$sResp[] =  array("errmsg" => $errmsg, "sql" => $sql);
		while ($row = mysqli_fetch_assoc($result))
		{
		$sRow["bID"]=$row["book_ID"];
			$sRow["bname"]=$row["bookName"];
				$sRow["sname"]=$row["subjectName"];
		$sRow["imgSrc"]=$row["image"];
			$sRow["notes"]=$row["notes"];
				$sRow["price"]=$row["price"];
				$sResp[] = $sRow;
				}
		echo json_encode($sResp);
	
	
	
				}
				//exit;
    
}*/

function DisplayBookDetail($conn){
    
    $tempBookID=$_POST['bookNumID'];
    $bookID=intval($tempBookID);
     $strJSON = "";
		//$strErr = "";
    
    $sql="select BooksOnSale.*,departmentName,subjectName,statusName,city from BooksOnSale left join Departments on (BooksOnSale.departmentID = Departments.department_ID) left join Subjects on (BooksOnSale.subjectID = Subjects.subject_ID) left join BookStatus on(BooksOnSale.bookStatusID = BookStatus.status_ID ) left join Users on(BooksOnSale.sellerID = Users.user_ID )where BooksOnSale.book_ID = $bookID";
    
    $result=$conn->query($sql);
    
		//$sResp[] =  array("errmsg" => $errmsg, "sql" => $sql);
		while ($row = mysqli_fetch_assoc($result))
		{
		$sRow["bID"]=$row["book_ID"];
			$sRow["bname"]=$row["bookName"];
				$sRow["sname"]=$row["subjectName"];
            $sRow["dname"]=$row["departmentName"];
            $sRow["isbn"]=$row["ISBN_number"];
		$sRow["imgSrc"]=$row["image"];
            $sRow["date"]=$row["uploadDate"];
            $sRow["bStatID"]=$row["bookStatusID"];
            $sRow["bStatus"]=$row["statusName"];
            $sRow["loc"]=$row["city"];
            $sRow["sellerID"]=$row["sellerID"];
			$sRow["notes"]=$row["additionalNotes"];
				$sRow["price"]=$row["price"];
				$sResp[] = $sRow;
       }
            
   // $sJSON = rJSONBooks($sql,$result);
	//echo $sJSON;
    echo json_encode($sResp);
}

function getEmail($conn,$id){
    
    $sql="select * from Users where user_ID = $id ";
    $result=$conn->query($sql);
    $row=mysqli_fetch_assoc($result);
    $email=$row['email'];
    
    return $email;
}

function emailBookSeller($conn){
    
  $senderName=$_POST['buyerName'];
    
  $msg=$_POST['msg'];
    
 $temp_sellerID=$_POST['sellerID'];
  $sellerID=intval($temp_sellerID);
$seller_email=getEmail($conn,$sellerID);

  $email_bdy = $msg . "\n\n from  " . $senderName;
    
 $email_sbj ="Some wants to buy your book!";
    
  $email_from=$_SESSION['USERNAME']; //username is email

sendEmail($seller_email, $email_bdy, $email_sbj,$email_from,"once",$conn);
  
  $sResp[] =  array("errmsg" => "no", "msg" => "Your email is Successfully Sent" );
    echo json_encode($sResp);   
}

function addBookToWishList($conn){
     $warn="";
	$errmsg = "no";
    
   $temp_bookID=$_REQUEST['bookID'];
    $bookID=intval($temp_bookID);
    
   $temp_userID=$_SESSION['ID'];
   $userID=intval($temp_userID);
    
    $sql1="select * from WishList where BookID=$bookID and userID=$userID limit 1";
   $check = $conn->query($sql1);
   //$result= mysqli_query($conn,$sql1);

	if(mysqli_fetch_array($check) != 0){
		$warn = 'Book existing in your wishList Already';
	    $errmsg = "yes";
	}else{
        
    $sql="INSERT INTO WishList (userID, bookID) VALUES ($userID, $bookID)";
    $result=$conn->query($sql);
    if($result)
			$warn = "Added to WishList";
     else
         $warn = 'sql error';
    }
    
    $sResp[] =  array("errmsg" => $errmsg, "msg" => $warn );
		echo json_encode($sResp);
    
}

function showUserWishList($conn){
      $strJSON = "";
		$strErr = "";
    $temp_userID=$_SESSION['ID'];
   $userID=intval($temp_userID);
    
    
    $sql="select WishList.*,bookName,price,image,additionalNotes,subjectName from WishList left join BooksOnSale on (WishList.bookID=BooksOnSale.book_ID) left join Subjects on(BooksOnSale.subjectID=Subjects.subject_ID) where WishList.userID = $userID";
    
    $result=$conn->query($sql);
    
    if (mysqli_num_rows($result)==0){
		//$strErr = '{"errmsg" : "'. $sql . ' ' . 'There is no matching record found."}';
		$strErr = '{"errmsg" : "There is no matching record found."}';
		$strJSON = "[". $strErr ."]";
		echo $strJSON;
		}
		else
		{
		$sResp[] =  array("errmsg" => $errmsg, "sql" => $sql);
		while ($row = mysqli_fetch_assoc($result))
		{
		$sRow["bID"]=$row["bookID"];
			$sRow["bname"]=$row["bookName"];
				$sRow["sname"]=$row["subjectName"];
		$sRow["imgSrc"]=$row["image"];
			$sRow["notes"]=$row["additionalNotes"];
				$sRow["price"]=$row["price"];
				$sResp[] = $sRow;
				}
        }
   // $sJSON = rJSONBooks($sql,$result);
	//echo $sJSON;
    echo json_encode($sResp);
}

function deleteBookFromWishList($conn){
     $warn="";
	$errmsg = "no";
    
   $temp_bookID=$_REQUEST['bookID'];
    $bookID=intval($temp_bookID);
    
   $temp_userID=$_SESSION['ID'];
   $userID=intval($temp_userID);
    
    
$sql="delete from WishList where BookID=$bookID and userID=$userID ";
    $result=$conn->query($sql);
    if($result)
			$warn = "Removed From WishList";
     else
         $warn = 'sql error';
    
    $sResp[] =  array("errmsg" => $errmsg, "msg" => $warn );
		echo json_encode($sResp);
    
}

function displayUserPostedBooks($conn){
    
      $strJSON = "";
		$strErr = "";
    $temp_userID=$_SESSION['ID'];
   $userID=intval($temp_userID);
    
    $sql="select BooksOnSale.*,departmentName,subjectName,statusName,city from BooksOnSale left join Departments on (BooksOnSale.departmentID = Departments.department_ID) left join Subjects on (BooksOnSale.subjectID = Subjects.subject_ID) left join BookStatus on(BooksOnSale.bookStatusID = BookStatus.status_ID ) left join Users on(BooksOnSale.sellerID = Users.user_ID) where BooksOnSale.sellerID = $userID order by uploadDate asc";
    
    $result=$conn->query($sql);
    
    if (mysqli_num_rows($result)==0){
		//$strErr = '{"errmsg" : "'. $sql . ' ' . 'There is no matching record found."}';
		$strErr = '{"errmsg" : "There is no matching record found."}';
		$strJSON = "[". $strErr ."]";
		echo $strJSON;
		}
		else
		{
		$sResp[] =  array("errmsg" => $errmsg, "sql" => $sql, "email" => $_SESSION['USERNAME']);
		while ($row = mysqli_fetch_assoc($result))
		{
		$sRow["bID"]=$row["book_ID"];
			$sRow["bname"]=$row["bookName"];
				$sRow["sname"]=$row["subjectName"];
		$sRow["imgSrc"]=$row["image"];
			$sRow["notes"]=$row["additionalNotes"];
				$sRow["price"]=$row["price"];
            $sRow["bStatus"]=$row["bookStatusID"];
            
				$sResp[] = $sRow;
				}
    }
   // $sJSON = rJSONBooks($sql,$result);
	//echo $sJSON;
    echo json_encode($sResp);
    
}

function editUserPostedBooksAction($conn){
   $temp_bookID=$_REQUEST['bookID'];
    $bookID=intval($temp_bookID);
    
   $temp_userID=$_SESSION['ID'];
   $userID=intval($temp_userID);
    
    if(isset($_REQUEST["deletePostBook"]) && $_REQUEST["deletePostBook"]=="yes")
    {
        $sql="delete from BooksOnSale where Book_ID=$bookID and sellerID=$userID";
        $sql2="delete from WishList where BookID=$bookID";
        editUserPostedBooks($conn, $sql, $sql2);
    }
    
     if(isset($_REQUEST["reservePostBook"]) && $_REQUEST["reservePostBook"]=="yes")
    {
        $sql="update BooksOnSale set bookStatusID =2 where Book_ID=$bookID and sellerID=$userID";
        editUserPostedBooks($conn, $sql, "");
    }
    
    if(isset($_REQUEST["soldPostBook"]) && $_REQUEST["soldPostBook"]=="yes"){
        $sql="update BooksOnSale set bookStatusID =3 where Book_ID=$bookID and sellerID=$userID";
        editUserPostedBooks($conn, $sql, "");
    }
    
}

function editUserPostedBooks($conn, $sql, $optionDelete){
      $warn="";
	$errmsg = "no";
    
    if($optionDelete != ""){
        $result1=$conn->query($optionDelete);
    }
    
    $result=$conn->query($sql);
    if($result){
          if($optionDelete != "")
			$warn = "Removed From List";
        else
            $warn = "Book Status Updated";
    }else
         $warn = 'sql error';
    
    $sResp[] =  array("errmsg" => $errmsg, "msg" => $warn );
		echo json_encode($sResp);
}


function displayAllDeptBooks($conn, $subjtID, $currentLoc){
    
  $strJSON = "";
   $strErr = "";
    $sql="select BooksOnSale.*,departmentName,subjectName,statusName,city from BooksOnSale left join Departments on (BooksOnSale.departmentID = Departments.department_ID) left join Subjects on (BooksOnSale.subjectID = Subjects.subject_ID) left join BookStatus on(BooksOnSale.bookStatusID = BookStatus.status_ID ) left join Users on(BooksOnSale.sellerID = Users.user_ID) where BooksOnSale.subjectID=$subjtID order by case when Users.city = '$currentLoc' then 1 else 2 end, Users.city";
    
    $result=$conn->query($sql);
    
    if (mysqli_num_rows($result)==0){
		//$strErr = '{"errmsg" : "'. $sql . ' ' . 'There is no matching record found."}';
		$strErr = '{"errmsg" : "There is no matching record found."}';
		$strJSON = "[". $strErr ."]";
		echo $strJSON;
		}
		else
		{
		$sResp[] =  array("errmsg" => $errmsg, "sql" => $sql);
		while ($row = mysqli_fetch_assoc($result))
		{
		$sRow["bID"]=$row["book_ID"];
			$sRow["bname"]=$row["bookName"];
				$sRow["sname"]=$row["subjectName"];
		$sRow["imgSrc"]=$row["image"];
			$sRow["notes"]=$row["additionalNotes"];
				$sRow["price"]=$row["price"];
				$sResp[] = $sRow;
				}
            
    }
   // $sJSON = rJSONBooks($sql,$result);
	//echo $sJSON;
    echo json_encode($sResp);
}

function showRandThreeBooksOnSale($conn){
    $strJSON = "";
   $strErr = "";
    $sql="select BooksOnSale.*,departmentName,subjectName from BooksOnSale left join Departments on (BooksOnSale.departmentID = Departments.department_ID) left join Subjects on (BooksOnSale.subjectID = Subjects.subject_ID) left join BookStatus on(BooksOnSale.bookStatusID = BookStatus.status_ID ) order by rand() limit 3";
    
    $result=$conn->query($sql);
    
    if (mysqli_num_rows($result)==0){
		//$strErr = '{"errmsg" : "'. $sql . ' ' . 'There is no matching record found."}';
		$strErr = '{"errmsg" : "There is no matching record found."}';
		$strJSON = "[". $strErr ."]";
		echo $strJSON;
		}
		else
		{
		$sResp[] =  array("errmsg" => $errmsg, "sql" => $sql);
		while ($row = mysqli_fetch_assoc($result))
		{
			$sRow["bname"]=$row["bookName"];
				$sRow["sname"]=$row["subjectName"];
		    $sRow["imgSrc"]=$row["image"];
				$sResp[] = $sRow;
				}
            
        }
   // $sJSON = rJSONBooks($sql,$result);
	//echo $sJSON;
    echo json_encode($sResp);
    
}
function signOut($conn){
    // remove all session variables
session_unset(); 

// destroy the session 
session_destroy(); 
    
    $conn->close();
    echo "signOut Successful";
}

?>
