<?php 

//phpinfo();

header('Access-Control-Allow-Origin: *');

//sendEmail('', "welcome to skoobs\n.  pls do not reply this email", 'confirmation email', 'skoobscs476@gmail.com', "multiple");

/*$user_email = "okpalacollins4@gmail.com";
 
    //$email_subject = "Car Rental Contact Message";

$mailMSG="Welcome to SKOOB App. This is a confirmation email. please Do not Reply this mail.";

sendEmail('', $user_email, $mailMSG, 'signup');


function sendEmail($email_from, $email_to, $mailText, $option){
    
     $email_subject = "SKOOB Notification Message";
    
    function clean_string($string) {
 
      $bad = array("content-type","bcc:","to:","cc:","href");
 
      return str_replace($bad,"",$string);
 
    }
    
    
    $email_message = clean_string($mailText);
    
    
if($option == "signup"){

    $headers = "From: SKOOB\r\n".

    'X-Mailer: PHP/' . phpversion();

          mail($email_to, $email_subject, $email_message, $headers); 

    if(isset($_SERVER['HTTP_REFERER'])) {
        echo "Message sent successfully.<br>Thank you for your comments.";
    }  

        
}
    
if($option == "messageSeller"){
       
      // Basic email headers
 
        $headers = 'From: '.$email_from."\r\n".

        'Reply-To: '.$email_to."\r\n" .

        'X-Mailer: PHP/' . phpversion();

        mail($email_to, $email_subject, $email_message, $headers); 

        if(isset($_SERVER['HTTP_REFERER'])) {
            echo "Message sent successfully.<br>Thank you for your comments.";
        }  
}
    
}*/



function sendEmail($email_to, $email_bdy, $email_sbj, $email_reply, $option){
    require 'test_conn.php';
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
            echo"mail sent";


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
/*$to = "okpalacollins4@gmail.com";
         $subject = "Car Rental Contact Message";
         
         $message = "<b>Welcome to SKOOB App. </b>";
         $message .= "<h1>This is a confirmation email. please Do not Reply this mail.</h1>";
         
         $header = "From:okpalacollins4@gmail.com \r\n";
         $header .= "Cc:afgh@somedomain.com \r\n";
         $header .= "MIME-Version: 1.0\r\n";
         $header .= "Content-type: text/html\r\n";
         
         $retval = mail ($to,$subject,$message,$header);
         
         if( $retval == true ) {
            echo "Message sent successfully...";
         }else {
            echo "Message could not be sent...";
         }*/
?>
