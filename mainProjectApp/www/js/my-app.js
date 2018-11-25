//http://docs.phonegap.com/en/edge/cordova_camera_camera.md.html
//https://www.npmjs.com/package/cordova-plugin-camera
//and check ur youtube video for the 
//https://www.tutorialspoint.com/framework7/index.htm
// Initialize app
//https://pushbots.com/
//http://thejackalofjavascript.com/pushbots-and-cordova/
//https://codesundar.com/lesson/phonegap-plugin-push/
//http://thejackalofjavascript.com/phonegap-3-cli-setup-mac-windows/
//https://stackoverflow.com/questions/18076013/setting-session-variable-using-javascript
//https://stackoverflow.com/questions/3608669/capturing-native-button-clicks-in-android-phone-in-javascript
var myApp = new Framework7({
    material: true,
    // If it is webapp, we can enable hash navigation:
    pushState: true,
    // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    },
    swipePanel: 'left',
    
});



// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true,
});

sessionStorage.stat=false;
//https://stackoverflow.com/questions/22704997/how-to-get-city-name-from-latitude-and-longitude-in-phone-gap

//http://docs.phonegap.com/en/edge/cordova_geolocation_geolocation.md.html#geolocation.getCurrentPosition

function setLocation(loc){
    this.newLocation=loc;
}

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log("navigator.geolocation works well");
    var options = { timeout: 30000, enableHighAccuracy: true };
        navigator.geolocation.getCurrentPosition(GetPosition, PositionError, options);
    }

function GetPosition(position)
{
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      ReverseGeocode(latitude,longitude);   // Pass the latitude and longitude to get address.
}
 
function PositionError() {
      console.log('Could not find the current location.');
}


function ReverseGeocode(latitude, longitude){
    var reverseGeocoder = new google.maps.Geocoder();
    var currentPosition = new google.maps.LatLng(latitude, longitude);
    reverseGeocoder.geocode({'latLng': currentPosition}, function(results, status) {
 
            if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                         var add= results[0].formatted_address ;
                    var  value=add.split(",");

                    count=value.length;
                    country=value[count-1];
                    state=value[count-2];
                    city=value[count-3];
                    //alert("city name is: " + city);
                        
                        var element = document.getElementById('showLocation');
        element.innerHTML = city + '<span><i class="material-icons md-light" style="width:50px;">location_on</i></span>';
                      sessionStorage.newcurrentLoc=city;
                   /* navigator.notification.alert('Address : ' + results[0].formatted_address + ',' + 'Type : ' + results[0].types);*/
                        
                    }
            else {
                   console.log('Unable to detect your address.');
                    }
        } else {
            console.log('Unable to detect your address.');
        }
    });
}

$$('.panel-left').on('open', function () {
    //myApp.alert('Left panel opened!');
    
     var checkl=sessionStorage.getItem("stat");
    if(checkl =='true'){
       // alert("here");
       $$('.panel-left a[id="signBtnHtml"]').html("sign out");
    }
});
   



// Handle Device Ready Event when loading the index page
$$(document).on('deviceready', function() {
  /*  https://forum.ionicframework.com/t/press-back-button-again-to-exit/4725
document.addEventListener("backbutton", function () { 
        alert('Back button');
    }, false); */ 
     $$.ajax({
		url: 'http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?randomBooks=yes',
		  type: 'POST',
		  dataType: 'json',
        
          data: {},
          beforeSend: function(){
               //myApp.showIndicator();
              $$("#indexCardImage").html(myApp.showIndicator()); 
          },
          complete: function(){
             //myApp.hideIndicator();
               $$("#indexCardImage").html(myApp.hideIndicator());
          },
		  success: function(result){
            var row="";
            var i=1;  
         while(i < result.length){
         row +=' <div style="background-image:url(php/' + result[i].imgSrc +')"  class="header color-white no-border">' + result[i].sname +'<br><br><br><br><br><br><br>' + result[i].bname +'</div>';
             i++
         }
         
         $$("#indexCardImage").html(row); 
          }
	});
    
    var checkl=sessionStorage.getItem("stat");
    if(checkl =='false'){
       // alert("here");
      $$('.panel-left a[id="signBtnHtml"]').html("sign in");
    }
    else{
       // alert("here");
    }
    
    
 $$("#signBtnHtml").click(function(e){
      var checkl=sessionStorage.getItem("stat");
    if(checkl =='false'){
       // alert("here");
      //openlogin screen
        myApp.loginScreen();
    }
    else{
        myApp.confirm('Are you sure you want to signOut?','SKOOB',
        function () {
       // myApp.alert('You clicked Ok button');
          $$.post('http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?signOut=yes', {},  function (data) { 
                myApp.alert(data,'SKOOB');
                      $$('.panel-left a[id="signBtnHtml"]').html("sign in");
                      $$('.panel-left p[id="note"]').html("sign in to get the most out of SKOOB");
                      sessionStorage.setItem("stat",false);
              mainView.router.loadPage('index.html');
                });
         });
    }
});
    
    $$("#indexSellBook").click(function(e){
      var checkl=sessionStorage.getItem("stat");
    if(checkl =='false'){
        myApp.loginScreen();
    }
    else{
       mainView.router.loadPage('camera.html');
    }
       });
    
    $$("#indexBrowselink").click(function(e){
       mainView.router.loadPage('browse.html');
    //mainView.router.load({pageName: 'browse'});
       });
    
    /*$$.get('http://localhost/~okpalacollins4/www/php/test.php', function (data) {
  console.log(data);
});*/
   $$("#cam_link").click(function(e){
       var check=sessionStorage.getItem("stat");
    //myApp.alert(check);
       
        if(check == 'false'){
           e.preventDefault();
           e.stopPropagation();
          // myApp.alert("here");
            myApp.loginScreen();
       }
       
       });
    
    $$("#wishList_link").click(function(e){
          var check=sessionStorage.getItem("stat");
    //myApp.alert(check);
        
        if(check == 'false'){
           e.preventDefault();
           e.stopPropagation();
        //   myApp.alert("here");
            myApp.loginScreen();
       }
       });
    
    $$("#profile_link").click(function(e){ 
          var check=sessionStorage.getItem("stat");
   // myApp.alert(check);
        
        if(check == 'false'){
           e.preventDefault();
           e.stopPropagation();
        //   myApp.alert("here");
            myApp.loginScreen();
       }
       });
    //window.plugins.PushbotsPlugin.initialize("59edc8789b823a7c168b4570", {"android":{"sender_id":"59778597084"}});
    //var Loc=sessionStorage.getItem("newcurrentLoc");
    //$$("#cities").val(Loc);
    //myApp.alert(newLoc);
    
    //var e = document.getElementById("inlineFormCustomSelect1");
    	      // var status = e.options[e.selectedIndex].value;
    
    $$("#showLocation").click(function(){
  // myApp.prompt('What is your name?');
        myApp.alert('<select id = "cities" ><option value="prompt"disabled selected>Select a City</option><option value = "Estevan">Estevan</option><option value = "Lloydminster">Lloydminster</option><option value = "MooseJaw">Moose Jaw</option><option value = "NorthBattleford">North BattleFord</option><option value = "PrinceAlbert">Prince Albert</option><option value = "Regina">Regina</option><option value = "Saskatoon">Saskatoon</option><option value = "SwiftCurrent">Swift Current</option><option value = "Weyburn">Weyburn</option><option value = "Yorkton">Yorkton</option></select>','CHANGE LOCATION',function Change(){
           
            var Loc_select = $$('#cities').val();
            if(Loc_select != "prompt"){
                sessionStorage.newcurrentLoc=Loc_select;
            } 
            var newLoc=sessionStorage.getItem("newcurrentLoc");
           
        var element = document.getElementById('showLocation');
        element.innerHTML = newLoc+ '<span><i class="material-icons md-light" style="width:50px;">location_on</i></span>';
      });
        
});
    
    $$("#HomeBtn").click(function(){
   // myApp.alert('Here comes index page');
  myApp.closePanel();
    /*var newLoc=sessionStorage.getItem("newcurrentLoc");
           
        var element = document.getElementById('showLocation');
        element.innerHTML = newLoc+ '<span><i class="material-icons md-light" style="width:50px;">location_on</i></span>';*/
        mainView.router.load({pageName: 'index'});
});

    console.log("index is ready!");
    
    $$("#searchbarIndexPage").on('keyup', function (e) {
    if (e.keyCode == 13) {// when the user presses the enter key
        
        var searchKey = $$('#searchbarIndexPage').val();
        
       mainView.router.loadPage('browseInfo_Display.html?indexSearchKey='+searchKey);
         $$("#searchbarIndexPage").blur(); 
    }
        
    
   });

});
//loading the 
myApp.onPageInit('camera', function (page) {
    var pageContainer = $$(page.container);
   
sessionStorage.imageData="";    
sessionStorage.imageDataURI="";   

    
 myApp.closePanel();
document.addEventListener('deviceready',onDevice,false);

function onDevice(){
    
 $$('.ac-5').on('click', function () {
    var buttons = [
        {
            text: 'take a picture',
            bg: 'gray',
            onClick: function () {
                   takePicture();
            }
        },
        {
            text: 'select picture from Galarey',
            bg:'yellow',
            onClick: function () {
                takePictureGallary();
            }
        },
        {
            text: 'Cancel',
            color: 'red',
            onClick: function () {
               // myApp.alert('Cancel clicked');    
            }
        },
    ];
    myApp.actions(buttons);
});      
    
    
$$("#btn1").click(function(){
   takePicture();
});
$$("#btn2").click(function(){
   takePictureGallary();
});
    
function takePicture(){
    navigator.camera.getPicture(success,error,{
        quality:50,
        destinationType:Camera.DestinationType.DATA_URL
    });

}
    
function takePictureGallary(){
    navigator.camera.getPicture(successPhotoURI,error,{
        quality:50,
        destinationType:Camera.DestinationType.FILE_URL,
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
    });

} 
    
function success(imageData){
    var img = document.getElementById('img1');
    img1.style.display = 'block';
    img.src = "data:image/jpg;base64,"+imageData;
    
    sessionStorage.setItem("imageData_check","yes");
    sessionStorage.setItem("imageDataURI_check","no");
    
    sessionStorage.setItem("imageData", imageData);
}
    
function successPhotoURI(imageDataURI){
    var img = document.getElementById('img1');
    img1.style.display = 'block';
    img.src = imageDataURI;
    
     sessionStorage.setItem("imageData_check","no");
    sessionStorage.setItem("imageDataURI_check","yes");
    
    sessionStorage.setItem("imageDataURI", imageDataURI);
}
    
    
function error(err){
    console.log("errrrorrr------>"+err);
}
    

}
    
$$('#subject').on('click', function () {
           //Here you can check whether we have already opened picker or not
           var dprt = pageContainer.find('input[name="department"]').val();
    
    if(dprt == "Business Administration"){
        var pickerSubject = myApp.picker({
        input: '#subject',
        cols: [
            {
                textAlign: 'center',
                values: ['Business Administration']
            }
        ]
        });
        
    }
    
    if(dprt == "Kinesiology and Health Studies"){
        var pickerSubject = myApp.picker({
        input: '#subject',
        cols: [
            {
                textAlign: 'center',
                values: ['Kinesiology and Health Studies']
            }
        ]
        });
    }
     if(dprt == "Science"){
        var pickerSubject = myApp.picker({
    input: '#subject',
    cols: [
        {
            textAlign: 'center',
            values: ['Biology','Chemistry & Biochemistry','Computer Science','Geology','Mathematics and Statistics','Physics', ]
        }
    ]
});
    }
     if(dprt == "Arts"){
        var pickerSubject = myApp.picker({
    input: '#subject',
    cols: [
        {
            textAlign: 'center',
            values: ['Anthropology','Economics', 'English','French','History', 'Geography and Environmental Studies', 'International Languages', 'Journalism', 'Justice Studies','Philosophy & Classics ','Politics & International Studies', 'Psychology','Religious Studies','Sociology & Social Studies', 'Women & Gender Studies']
        }
    ]
        });
    }
    
     if(dprt == "Engineering and Applied Science"){
        var pickerSubject = myApp.picker({
    input: '#subject',
    cols: [
        {
            textAlign: 'center',
            values: ['Electronic Systems Engineering','Engineering and Applied Science', 'Environmental Systems Engineering', 'Petroleum Systems Engineering','Software Systems Engineering']
        }
    ]
     });
        
    }
    
    if(dprt == "Media, Arts and Performance"){
        var pickerSubject = myApp.picker({
    input: '#subject',
    cols: [
        {
            textAlign: 'center',
             values: ['Creative Technologies','Film','Interdisciplinary Studies','Music','Theatre','Visual Arts']
        }
    ]
     });
        
    }
    
    
    });

var pickerDepartment = myApp.picker({
    input: '#picker-department',
    cols: [
        {
            textAlign: 'center',
            values: ['Arts', 'Business Administration', 'Kinesiology and Health Studies', 'Media, Arts and Performance', 'Science', 'Engineering and Applied Science']
        }
    ]
});
    
/*var pickerSubject = myApp.picker({
    input: '#subject',
    cols: [
        {
            textAlign: 'center',
            values: ['Anthropology', 'Biology','Business Administration', 'Chemistry & Biochemistry','Computer Science','Creative Technologies','Economics',' Electronic Systems Engineering','Engineering and Applied Science', 'English', 'Environmental Systems Engineering','Film','French', 'Geography and Environmental Studies','Geology','History','Industrial Systems Engineering',  'International Languages', 'Interdisciplinary Studies','Journalism', 'Justice Studies', 'Kinesiology and Health Studies','Mathematics and Statistics','Music','Petroleum Systems Engineering','Philosophy & Classics ','Physics', 'Politics & International Studies', 'Psychology','Religious Studies','Software Systems Engineering', 'Theatre','Visual Arts']
        }
    ]
});*/
    
 $$("#submitBookForm").on('click', function () {
    var bname = pageContainer.find('input[name ="bookName"]').val();
    var isbn = pageContainer.find('input[name="isbn_no"]').val();
 var dprt = pageContainer.find('input[name="department"]').val();
     var price = pageContainer.find('input[name="price"]').val();
    var sbjt = pageContainer.find('input[name="subject"]').val();
     var notes = pageContainer.find('textarea[name="notes"]').val();
     var imageData_c=sessionStorage.getItem("imageData_check");
      var imageDataURI_c=sessionStorage.getItem("imageDataURI_check");
   var photoCam=sessionStorage.getItem("imageData");
  var photoGalla=sessionStorage.getItem("imageDataURI");
   
     document.getElementById("bname_err").innerHTML ="";
     document.getElementById("isbn_err").innerHTML ="";
      document.getElementById("dprt_err").innerHTML ="";
      document.getElementById("sbjt_err").innerHTML ="";
     document.getElementById("isbn_err").innerHTML ="";
     
 //myApp.alert('email: ' + bname + ', Password: ' + isbn + ', city: '+ dprt +  ', city: '+sbjt+', notes: '+ notes);
     
    var result = true; 
    
     if (bname == '') {
          document.getElementById("bname_err").innerHTML ="Please enter textbook name.";
		  result = false;
		  }
      if (isbn == '') {
          document.getElementById("isbn_err").innerHTML ="Please enter the book's ISBN number.";
		  result = false;
		  }
     if (dprt == '') {
          document.getElementById("dprt_err").innerHTML ="Please select a department";
		  result = false;
		  }
      if (sbjt == '') {
          document.getElementById("sbjt_err").innerHTML ="Please select a subject";
		  result = false;
		  }
     if (isbn == '') {
          document.getElementById("isbn_err").innerHTML ="Please enter the book ISBN.";
		  result = false;
		  }
     if (isbn.length != 13) {
          document.getElementById("isbn_err").innerHTML ="Please enter a valid ISBN.";
		  result = false;
		  }
     if(photoCam == '' && photoGalla == ''){
         myApp.alert("please upload the book picture",'SKOOB');
         result=false;
     }
     
     
     
     
if(result!=false){
         
    function uploadPhoto(imageURI) {
        myApp.showIndicator();
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1)+'.png';
   options.mimeType="text/plain";
    options.params = {
        'bookName' : bname,
    'isbn_NUM' : isbn,
    'department' : dprt,
    'subject' : sbjt,
    'price' : price,
    'notes' : notes
    };   
   
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?sellBook=yes&photoGalla=yes"), win, fail, options);
        
    
}

function win(r){
     myApp.hideIndicator();
    // alert("here");
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    myApp.alert("Form Submitted Successfully",'SKOOB');
    document.getElementById("my-formBook").reset();
    var img = document.getElementById('img1');
    img.src="";
    
}

function fail(error){
     myApp.hideIndicator();
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}
         
 function uploadPhotoCam(imageData){
      myApp.showIndicator();
       $$.ajax({ url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?sellBook=yes&photoCam=yes",
		  type: 'post',
		  dataType: 'text',
	         data : {
                bookName : bname,
                isbn_NUM : isbn,
                department : dprt,
                subject : sbjt,
                price : price,
                notes : notes,
                 image: imageData
             },
	          success: function(data){
                  myApp.alert(data,'SKOOB');
                  document.getElementById("my-formBook").reset();
                    var img = document.getElementById('img1');
                    img.src="";
                   myApp.hideIndicator();
                  mainView.router.reloadPage('camera.html');
              }
	  });
 }        
         
    if(imageData_c=="yes"&&imageDataURI_c=="no"){
        uploadPhotoCam(photoCam);
    }      
    if(imageData_c=="no"&&imageDataURI_c=="yes"){
        
        uploadPhoto(photoGalla);
     }
}
});   

});



myApp.onPageInit('wishlist', function (page) {
     $$('.cached').each(function(){
    var pageName = $$(this).data('page');
    if(pageName === page.name){
         $$(this).remove();
    }
});
    myApp.closePanel();
    
 
    $$.ajax({
		url: 'http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayWishlistBooks=yes',
		  type: 'POST',
		  dataType: 'json',
        
          data: {},
          beforeSend: function(){
               myApp.showIndicator();
          },
          complete: function(){
             myApp.hideIndicator();
          },
		  success: displayJsonData,     
		  error: printerror
	});

function displayJsonData(myArr){
    
    if(myArr==null || myArr.length<=0){
    	alert("here");
    	$$("#display_wishList").empty();
	return;
    }

    errmsg = myArr[0].errmsg;
    $$("#message").html(errmsg);

    /* sql =myArr[0].sql;
    $$("#message").html(sql);*/
    
    var row="";
    var count = 0;
    for(var i = 1; i < myArr.length; i++) {
        
       row += ' <li class="swipeout">';
       row += ' <div class="swipeout-content">';
     row += ' <a href="browseBook_Detail.html?bookID=' + myArr[i].bID +'" class="item-link item-content">';
        row += '<div class="item-media"><img src="php/' + myArr[i].imgSrc+'" width="80"></div>';
       row += ' <div class="item-inner">';
        row += '  <div class="item-title-row">';
            row += '<div class="item-title">' + myArr[i].bname +'</div>';
            row += '<div class="item-after">$' + myArr[i].price +'</div>';
          row += '</div>';
          row += '<div class="item-subtitle">' + myArr[i].sname +'</div>';
         row += ' <div class="item-text">' + myArr[i].notes +'</div>';
        row += '</div>';
     row += ' </a>';
      row += '  </div>';
  row += '<div class="swipeout-actions-right">';
         row += '<a href="#" class="swipeout swipebtn"  data-id="' + myArr[i].bID +'" data-count="'+count+'">Remove</a>';
  row += '</div>';
  row += '  </li>';
        count++;
        
    }
    
     var element=document.getElementById('display_wishList');
        element.innerHTML = row;

$$('.swipebtn').on('click', function(){
       
     var bookID =  $$(this).data('id');
    
    var tempindex =  $$(this).data('count');
    var index= parseInt(tempindex)|| 0;
    
    myApp.confirm('Are you sure?','SKOOB',
      function () {
        
        var tempCount=0;
         $$(".swipebtn").each( function() {
              $$(this).attr("data-count", tempCount);
      });
      
         myApp.swipeoutDelete($$('li.swipeout').eq(index));
        count--;
        $$.ajax({  
        url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?deleteWishlist=yes",
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   bookID:bookID
              },
		      success: function(result){
                 myApp.addNotification({
                  message: result[0].msg
                 });
		      }  
		   });
      },
      function () {
      }
    );
});
    
    
}

function printerror() {
    $$("#message").html("No Books added to this list Yet");

}
    
});


$$('.open-login').on('click', function () {
  myApp.loginScreen();
});

$$('#signup').on('click', function () {
  myApp.closeModal();
});


 $$('.login-screen .list-button').on('click', function () {
    
            var email = $$('.login-screen input[name = "email"]').val();
            var pwd = $$('.login-screen input[name = "password"]').val();      
    
     //--------validate inputs -----------------------------------
     var result = true;
     
      document.getElementById("login_email").innerHTML ="";
      document.getElementById("login_pwd").innerHTML ="";
     
    if(email == ''){
         document.getElementById("login_email").innerHTML ="Please enter your email.";
		  result = false;
    }
     
    if(pwd == ''){
         document.getElementById("login_pwd").innerHTML ="Please enter your password.";
		  result = false;
    }
     
     
     //call database to verify
     if(result!=false){
         
         var newLoc=sessionStorage.getItem("newcurrentLoc");
         
       
        $$.ajax({  
        url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?login=yes",
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   email:email,
	  			   password:pwd
              },
		      success: function(result){
                  if(result.length > 1){
 	    		  myApp.alert(result[1].msg,'SKOOB');    
 	    		document.getElementById("my-form2").reset();
               myApp.closeModal('.login-screen');
                     sessionStorage.setItem("stat",true);
                     $$('.panel-left a[id="signBtnHtml"]').html("sign out");
                     $$('.panel-left p[id="note"]').html(result[0].userEmail);
 	    	  }
 	    	  else{
                  document.getElementById("login_email").innerHTML =result[0].msg;
 	    	  }
		    	
		      }  
		 });
     }
});

myApp.onPageInit('signup', function (page) {
    
     myApp.closePanel();
        var pageContainer = $$(page.container);
    
    var pickerCity = myApp.picker({
        input: '#picker-device',
        cols: [
            {
                textAlign: 'center',
                values: ['Estavan', 'Llyodminster', 'Moose Jaw', 'North Battleford', 'Prince Albert', 'Regina', 'Saskatoon', 'Swift Current', 'Weyburn', 'Yorkton']
            }
        ]
    });
    
  $$('#signupSubmit').on('click', function () {
         var email = pageContainer.find('input[name="email"]').val();
    var pwd1 = pageContainer.find('input[name="password1"]').val();
      var pwd2 = pageContainer.find('input[name="password2"]').val();
    var city = pageContainer.find('input[name="city"]').val();
    var notify = $$('#notifyOption').val();
       console.log("Validation called");
	  var result = true;
      
	  document.getElementById("email_err").innerHTML ="";
	  document.getElementById("pass1_err").innerHTML ="";
	  document.getElementById("pass2_err").innerHTML ="";
	  document.getElementById("city_err").innerHTML ="";
      
     var atpos=email.indexOf("@");
		  var dotpos=email.lastIndexOf(".");
		  if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length)
		   {
               
        document.getElementById("email_err").innerHTML ="Not a valid e-mail address";
		   }
      
		  if( email=="" || email==null )
			 { 
			 
			 document.getElementById("email_err").innerHTML ="Please enter an email";
			 result=false;
			 }
      
      if(notify=="choose")
			 { 
			 
			 document.getElementById("notify_err").innerHTML ="Please choose an option";
			 result=false;
			 }
      
       var invalid=" ";
	  var minLength=8;
	
	
	  if(pwd1.length < minLength){
			   
		  document.getElementById("pass1_err").innerHTML ='  Your password must be at least ' + minLength + ' characters long. Try again.';
		  result=false;
	  }

	  if(pwd1.indexOf(invalid) > -1){
				   
		  document.getElementById("pass1_err").innerHTML ="Sorry, spaces are not allowed in passowrds. please re-enter your password";
		  result=false;
	  }
	  
	  if(pwd1.indexOf(invalid) > -1){
		   
		  document.getElementById("pass1_err").innerHTML ="Sorry, spaces are not allowed in passowrds. please re-enter your password";
		  result=false;
	  }
	  
	  var regularExpression  = /[a-zA-Z0-9!@#$%^&*]$/;   ///\d+
	  if(!regularExpression.test(pwd1)) {
				   
		  document.getElementById("pass1_err").innerHTML ="password should contain atleast one number and one special character\n";
		  result=false;
	    }
	  
	if(pwd2 !== pwd1){
          document.getElementById("pass2_err").innerHTML ="You did not enter the same new password twice. Please re-enter your password.";
		  result = false;
		  }
      
      
	 if (pwd1 == '') {
          document.getElementById("pass1_err").innerHTML ="Please enter your password.";
		  result = false;
		  }
      if (pwd2 == '') {
          document.getElementById("pass2_err").innerHTML ="Please confrim password.";
		  result = false;
		  }
	
	 if(result!=false){
        $$.ajax({ 
        url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?signUp=yes",
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   email:email,
	  			   password:pwd1,
	  			   userLoc:city,
	  			   notifyOption:notify
              },
		      success: function(result){
		    	 if(result[0].errmsg == "no"){
 	    		  myApp.alert(result[0].msg,'SKOOB');    
 	    		document.getElementById("my-form1").reset();
 	    	  }
 	    	  else{
 	    		  myApp.alert(result[0].msg,'SKOOB'); 
 	    	  }
		    	
		      }  
		 });
     }
     
    });

});

myApp.onPageInit('browse', function (page) {
     myApp.closePanel();

 });

myApp.onPageInit('browseInfo_Display', function (page) {
    
    
    $$('.cached').each(function(){
    var pageName = $$(this).data('page');
    if(pageName === page.name){
         $$(this).remove();
    }
});
    var indexSearchKey = page.query.indexSearchKey;
    $$('#searchBarAllBooksPage').val(indexSearchKey);
 
     $$(document).on('deviceready', function() {
  
          var temp_currentLoc=sessionStorage.getItem("newcurrentLoc");
    var loc = temp_currentLoc.substr(temp_currentLoc.lastIndexOf(' ') + 1);     
     function is_int(value){
        
      if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
          return true;
      } else {
          return false;
      }
     }
       
         
if(indexSearchKey!=null){
    
    if(is_int(indexSearchKey)){

        if(indexSearchKey.length!=13){
                     myApp.alert("its a not valid isbn number",'SKOOB');
            var urlAll='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllBooks=yes';
           setOptions(urlAll); 
             //return;
        }
        else{
                   //alert("its a valid isbn number");
        var isbnURL='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllBooks=yes&displayAllBooksByISBN='+indexSearchKey;
              setOptions(isbnURL);
        }
    }
    else{
         
       var isbnURL='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllBooks=yes&displayAllBooksBysnameORbname='+indexSearchKey;
            setOptions(isbnURL);
        
                //alert("it is not  a number");
    }
}
  else {
     
        var urlAll='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllBooks=yes';
           setOptions(urlAll); 
    }
       
function setOptions(url){
   // alert("here func");
     myApp.showIndicator();
    $$.ajax({
		url: url,
		  type: 'POST',
		  dataType: 'json',
          data: {
              location:loc
              //location:"Regina"
          },
          /*beforeSend: function(){
               myApp.showIndicator();
          },
          complete: function(){
             myApp.hideIndicator();
          },*/
		  success: displayJsonData,     
		  error: printerror
	});
}
         
function displayJsonData(myArr){
    
    if(myArr==null || myArr.length<=0){
    	alert("here");
    	$$("#display_browseInfo").empty();
	return;
    }

    errmsg = myArr[0].errmsg;
    $$("#message").html(errmsg);

    var row="";
    for(var i = 1; i < myArr.length; i++) {
        
       row += ' <li class="swipeout">';
       row += ' <div class="swipeout-content">';
     row += ' <a href="browseBook_Detail.html?bookID=' + myArr[i].bID +'" class="item-link item-content">';
        row += '<div class="item-media"><img src="php/' + myArr[i].imgSrc+'" width="80"></div>';
       row += ' <div class="item-inner">';
        row += '  <div class="item-title-row">';
            row += '<div class="item-title">' + myArr[i].bname +'</div>';
            row += '<div class="item-after">$' + myArr[i].price +'</div>';
          row += '</div>';
          row += '<div class="item-subtitle">' + myArr[i].sname +'</div>';
         row += ' <div class="item-text">' + myArr[i].notes +'</div>';
        row += '</div>';
     row += ' </a>';
      row += '  </div>';
  row += '<div class="swipeout-actions-right">';
    row += '  <a href="#" class="bg-blue addWish" data-id="' + myArr[i].bID +'">Add To WishList</a>';
 row += ' </div>';
  row += '  </li>';
        
    }
    //$$("#display_browseInfo").html(row);
     var element=document.getElementById('display_browseInfo');
        element.innerHTML = row;
     myApp.hideIndicator();
    //alert(row);
    
 $$('.addWish').on('click', function () {
      var bookID =  $$(this).data('id');

    var check=sessionStorage.getItem("stat");
    if(check=='false'){
            myApp.loginScreen();
         }
    else{
             $$.ajax({  
        url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   bookID:bookID
              },
		      success: function(result){
                 myApp.addNotification({
                  message: result[0].msg
                 });
		      }  
		   });
             
        }
         
         
    });   
    
}

function printerror() {
	
    $$("#message").html("0 Results");

}
 
     
    $$("#searchBarAllBooksPage").on('keyup', function (e) {
        if (e.keyCode == 13) {// when the user presses the enter key

            var searchKeym = $$('#searchBarAllBooksPage').val();
          
           mainView.router.reloadPage('browseInfo_Display.html?indexSearchKey='+searchKeym);
             $$("#searchBarAllBooksPage").blur(); 
        }


    });
     
             
  }); 
  
 });

myApp.onPageInit('browseBook_Detail', function (page) {
   
     $$('.cached').each(function(){
    var pageName = $$(this).data('page');
    if(pageName === page.name){
         $$(this).remove();
    }
    });
    
    var bookID=page.query.bookID;
    
    $$(document).on('deviceready', function() {
     myApp.showIndicator();    
   
        $$.post('http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayBookDetail=yes', {bookNumID:bookID},  function (data) { 
           //  myApp.alert("m here");
  var obj = JSON.parse(data); 
  console.log(obj); 
        var row="";  
       row += ' <div class="container">';
 row += ' <img src="php/' + obj[0].imgSrc +'" /></div>';
            row += '<div class="card">';
     row += ' <div class="card-content">';
       row += ' <div class="card-content-inner">';
        
    row += '<p class="color-gray">Posted on ' + obj[0].date +'</p>';
         row += '  <p>Seller Location: ' + obj[0].loc +'</p>';
          row += '  <p>Book Name: ' + obj[0].bname +'</p>';
         row += ' </div>';
     row += ' </div>';
         row += '   </div>';
        
           row += '  <div class="card">';
      row += '<div class="card-content">';
      row += '  <div class="card-content-inner">';
        
    row += '<p>Department: ' + obj[0].dname +'</p>';
         row += '   <p>Subject: ' + obj[0].sname +'</p>';
          row += '  <p>ISBN: ' + obj[0].isbn +'</p>';
         row += ' </div>';
      row += '</div>';
        row += '    </div>';
        row += '    <div class="card">';
      row += '<div class="card-content">';
       row += ' <div class="card-content-inner">';
          row += '  <p>Price: $' + obj[0].price +'</p>';
            if(obj[0].bStatID =="2")
          row += '  <p class="color-amber">BookStatus: ' + obj[0].bStatus +'</p>';
            else if(obj[0].bStatID =="3")
         row += '  <p class="color-red">BookStatus: ' + obj[0].bStatus +'</p>';
            else
            row += '  <p class="color-green">BookStatus: ' + obj[0].bStatus +'</p>';
         row += ' </div>';
      row += '</div>';
         row += '   </div>';
            
           row += '  <div class="card">';
      row += '<div class="card-content">';
      row += '  <div class="card-content-inner">';
        
         row += '   <p>' + obj[0].notes +'</p>';
         row += ' </div>';
      row += '</div>';
         row += '   </div> ';    
    
      var sellerID = parseFloat(obj[0].sellerID);      
             
     var element=document.getElementById('Book_Detail');
        element.innerHTML = row;
         myApp.hideIndicator(); 
        var email_element=document.getElementById('sendMail');
        email_element.setAttribute("href", "sendEmail.html?sellerID="+sellerID+"");
        
            
         $$('#sendMail').on('click', function (e) {
              var check=sessionStorage.getItem("stat");
       if(check=='false'){
        e.preventDefault();
         e.stopPropagation();
        //   myApp.alert("here");
            myApp.loginScreen();
         }
     });
          
});
        
    });
    
});


myApp.onPageInit('sendEmail', function (page) {
      
     $$('.cached').each(function(){
    var pageName = $$(this).data('page');
    if(pageName === page.name){
         $$(this).remove();
    }
    });
    
     var sellerID = page.query.sellerID;
    //myApp.alert(sellerID);
    
    var pageContainer = $$(page.container);
        
 $$('#sendBtn').on('click', function () {
     
    var msg = pageContainer.find('textarea[name="message"]').val();
    var name = pageContainer.find('input[name="name"]').val();
        
     var result = true;
     document.getElementById("name_err").innerHTML ="";
	  document.getElementById("msg_err").innerHTML ="";
     
     if(msg == null || msg ==""){
          document.getElementById("name_err").innerHTML ="please Enter your name";
		  result=false;
     }
     if(name== null || name ==""){
          document.getElementById("msg_err").innerHTML ="please Enter your email message";
		  result=false;
     }
     if(result != false){
          myApp.showIndicator();
         
    /*$$(document).on('ajax:start', function (e) {
      var xhr = e.detail.xhr;
      myApp.showIndicator();
    });
        
        $$(document).on('ajax:complete', function (e) {
          var xhr = e.detail.xhr;
          myApp.hideIndicator();
        });*/
         
     $$.post('http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?emailSeller=yes', {sellerID:sellerID,buyerName:name,msg:msg},  function (data) { 
          var obj = JSON.parse(data); 
          console.log(obj); 
          myApp.hideIndicator();
         myApp.alert(obj["0"].msg,'SKOOB');
         document.getElementById("email-form").reset();
          
     });
    
     }
  });
   
    
});

myApp.onPageInit('Profile', function (page) {
    
     $$('.cached').each(function(){
    var pageName = $$(this).data('page');
    if(pageName === page.name){
         $$(this).remove();
    }
    });
    myApp.closePanel();
    
    
    
     $$(document).on('deviceready', function() {
          myApp.showIndicator();
          $$.ajax({
		url: 'http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayUserPostedBooks=yes',
		  type: 'POST',
		  dataType: 'json',
          data: {},
          /*beforeSend: function(){
               myApp.showIndicator();
          },
          complete: function(){
             myApp.hideIndicator();
          },*/
		  success: displayJsonData,     
		  error: printerror
	});
     //myApp.alert(" m here");
//}
/*function sendAction(url, bookID){
    
} */
function displayJsonData(myArr){
    
    if(myArr==null || myArr.length<=0){
    	alert("here");
    	$$("#display_wishList").empty();
	return;
    }

     errmsg = myArr[0].errmsg;
    $$("#message").html(errmsg);

    
    var profileHtml="";
    profileHtml+='<div class="card">';
    profileHtml+='<div class="card-content">';
    profileHtml+='<div class="list-block media-list">';
    profileHtml+='<ul>';
    profileHtml+=' <li class="item-content">';
    profileHtml+='<div class="item-media">';
    profileHtml+='<img src="image/dummyFace.png" width="44">';
    profileHtml+=' </div>';
    profileHtml+='<div class="item-inner">';
    profileHtml+='<div class="item-title-row">';
    profileHtml+=' <div class="item-title">'+ myArr[0].email+'</div>';
    profileHtml+='</div> </div> </li> </ul> </div>  </div> </div>';
    $$("#userProfile").html(profileHtml);
    
    /* sql =myArr[0].sql;
    $$("#message").html(sql);*/
    
    var row="";
    var count = 0;
    for(var i = 1; i < myArr.length; i++) {
         row += ' <li class="swipeout">';
       row += ' <div class="swipeout-content">';
     row += ' <a href="browseBook_Detail.html?bookID=' + myArr[i].bID +'" class="item-link item-content">';
        row += '<div class="item-media"><img src="php/' + myArr[i].imgSrc+'" width="80"></div>';
       row += ' <div class="item-inner">';
        row += '  <div class="item-title-row">';
            row += '<div class="item-title">' + myArr[i].bname +'</div>';
            row += '<div class="item-after">$' + myArr[i].price +'</div>';
          row += '</div>';
          row += '<div class="item-subtitle">' + myArr[i].sname +'</div>';
         row += ' <div class="item-text">' + myArr[i].notes +'</div>';
        row += '</div>';
     row += ' </a>';
      row += '  </div>';
      row += '  <div class="swipeout-actions-left">';
    row += ' <a href="#" class="bg-blue reserved" data-id="' + myArr[i].bID +'" data-status="'+ myArr[i].bStatus +'">Reserve</a>';
    row += '<a href="#" class="sold bg-orange" data-id="' + myArr[i].bID +'" data-status="'+ myArr[i].bStatus +'">Sold</a>';
  row += '</div>';
  row += '<div class="swipeout-actions-right">';
    row += '  <a href="#" class="swipeout swipebtn bg-red" data-id="' + myArr[i].bID +'">Remove</a>';
 row += ' </div>';
  row += '  </li>';
        count++; 
    }
    
     var element=document.getElementById('userPostedBooks');
        element.innerHTML = row;
    myApp.hideIndicator();
    //alert(row);
    
     $$('.swipebtn').on('click', function(){
       
     var bookID =  $$(this).data('id');
         var bookStat =  $$(this).data('status');
    
    var tempindex =  $$(this).data('count');
    var index= parseInt(tempindex)|| 0;
    
    myApp.confirm('Are you sure?', 'SKOOB',
      function () {
        
        var tempCount=0;
         $$(".swipebtn").each( function() {
       // alert( $$(this).attr("data-count") );
              $$(this).attr("data-count", tempCount);
      });
         myApp.swipeoutDelete($$('li.swipeout').eq(index));
        count--;
        $$.ajax({  
        url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?editUserPostedBooks=yes&deletePostBook=yes",
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   bookID:bookID,
                   bookStat:bookStat
              },
		      success: function(result){
                 myApp.addNotification({
                  message: result[0].msg
                 });
		      }  
		   });
      },
      function () {
       // myApp.alert('You clicked Cancel button');
      }
    );
});
    
    $$('.reserved').on('click', function () {
      var url ="http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?editUserPostedBooks=yes&reservePostBook=yes";
        var bookID =  $$(this).data('id');
       setOptions(url,bookID); 
    
});
$$('.sold').on('click', function () {
    var bookID =  $$(this).data('id');
        
     var url ="http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?editUserPostedBooks=yes&soldPostBook=yes";
       setOptions(url,bookID); 
});
}
  function printerror() {
    $$("#message").html();

}
         
function setOptions(ajaxurl, bookID){
     $$.ajax({  
        url: ajaxurl,
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   bookID:bookID
              },
		      success: function(result){
                 myApp.addNotification({
                  message: result[0].msg
                 });
		      }  
		   });
    
}
    });
});
    
myApp.onPageInit('browseArtsBooks', function (page) {
    var subject = page.query.subject;
  
    $$(document).on('deviceready', function() {
    if(subject=="economics"){
      var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Economics';
        setOptions(url);
        $$("#subjectNAme").html("economics");
    }
        
    if(subject=="history"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=History';
        setOptions(url);
         $$("#subjectNAme").html("history");
    }
    if(subject=="french"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=French';
        setOptions(url);
        $$("#subjectNAme").html("french");
    }
        if(subject=="philosophy"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Philosophy';
        setOptions(url);
        $$("#subjectNAme").html("philosophy");
    }
        if(subject=="women"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=women';
        setOptions(url);
        $$("#subjectNAme").html("Women & Gender Studies");
    }
    if(subject=="justice"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Philosophy';
        setOptions(url);
        $$("#subjectNAme").html("Justice Studies");
    }
        if(subject=="sociology"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Philosophy';
        setOptions(url);
        $$("#subjectNAme").html("Sociology & Social Studies");
    }
     if(subject=="Psychology"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Philosophy';
        setOptions(url);
        $$("#subjectNAme").html("Psychology");
    }
         if(subject=="politics"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Philosophy';
        setOptions(url);
        $$("#subjectNAme").html("Politics & International Studies");
    }
         if(subject=="Philosophy"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Philosophy';
        setOptions(url);
        $$("#subjectNAme").html("Philosophy & Classics");
    }
         if(subject=="International"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Philosophy';
        setOptions(url);
        $$("#subjectNAme").html("International Languages");
    }
          if(subject=="Journalism"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Philosophy';
        setOptions(url);
        $$("#subjectNAme").html("Journalism");
    }
          if(subject=="Geography"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Philosophy';
        setOptions(url);
        $$("#subjectNAme").html("Geography and Environmental Studies");
    }
         if(subject=="Anthropology"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Philosophy';
        setOptions(url);
        $$("#subjectNAme").html("Anthropology");
    }
        if(subject=="english"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Philosophy';
        setOptions(url);
        $$("#subjectNAme").html("English");
    }
    //and so on
    
        
   function setOptions(url){
 myApp.showIndicator();
        var temp_currentLoc=sessionStorage.getItem("newcurrentLoc");
    var loc = temp_currentLoc.substr(temp_currentLoc.lastIndexOf(' ') + 1); //take  everything after the space
       $$.ajax({
		url: url,
		  type: 'POST',
		  dataType: 'json',
          data: {
              location:loc
          },
          /*beforeSend: function(){
               myApp.showIndicator();
          },
          complete: function(){
             myApp.hideIndicator();
          },*/
		  success: displayJsonData,     
		  error: printerror
	});
       
    }
    
    function displayJsonData(myArr){
        
    if(myArr==null || myArr.length<=0){
    	alert("here");
    	$$("#display_artsBookSbjt").empty();
	return;
    }

    errmsg = myArr[0].errmsg;
   // alert(errmsg);
    $$("#message").html(errmsg);

    /* sql =myArr[0].sql;
    $$("#message").html(sql);*/
    
    var row="";
    for(var i = 1; i < myArr.length; i++) {
        
       row += ' <li class="swipeout">';
       row += ' <div class="swipeout-content">';
     row += ' <a href="browseBook_Detail.html?bookID=' + myArr[i].bID +'" class="item-link item-content">';
        row += '<div class="item-media"><img src="php/' + myArr[i].imgSrc+'" width="80"></div>';
       row += ' <div class="item-inner">';
        row += '  <div class="item-title-row">';
            row += '<div class="item-title">' + myArr[i].bname +'</div>';
            row += '<div class="item-after">$' + myArr[i].price +'</div>';
          row += '</div>';
          row += '<div class="item-subtitle">' + myArr[i].sname +'</div>';
         row += ' <div class="item-text">' + myArr[i].notes +'</div>';
        row += '</div>';
     row += ' </a>';
      row += '  </div>';
  row += '<div class="swipeout-actions-right">';
    row += '  <a href="#" class="bg-blue addWish" data-id="' + myArr[i].bID +'">Add To WishList</a>';
 row += ' </div>';
  row += '  </li>';
        
        
    }
    //$$("#display_browseInfo").html(row);
     var element=document.getElementById('display_artsBookSbjt');
        element.innerHTML = row;
    //alert(row);
     myApp.hideIndicator();
 $$('.addWish').on('click', function () {
      var bookID =  $$(this).data('id');
    //myApp.alert('added '+id); 
         
    var check=sessionStorage.getItem("stat");
    if(check=='false'){
            myApp.loginScreen();
         }
    else{
             $$.ajax({  //url: 172.16.1.69. "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
        url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   bookID:bookID
              },
		      success: function(result){
                 myApp.addNotification({
                  message: result[0].msg
                 });
		      }  
		   });
             
        }
         
         
    });   
    
}

 function printerror() {
	// myApp.alert("here");
    //$$("#message").html();
     
    // errmsg = myArr[0].errmsg;
    $$("#message").html("No book Posted on Sale yet");

  }
        
        
}); 
   
});


myApp.onPageInit('browseScienceBooks', function (page) {
    var subject = page.query.subject;
    //myApp.alert(subject);
    
    $$(document).on('deviceready', function() {
    if(subject=="computer"){
      var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=computer';
        setOptions(url);
        $$("#subjectNAme").html("computer science");
    }
        
    if(subject=="physics"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=physics';
        setOptions(url);
         $$("#subjectNAme").html("physics");
    }
    if(subject=="chemistry"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=chemistry';
        setOptions(url);
        $$("#subjectNAme").html("chemistry");
    }
        if(subject=="biology"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=biology';
        setOptions(url);
        $$("#subjectNAme").html("biology");
    }
        if(subject=="geology"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=geology';
        setOptions(url);
        $$("#subjectNAme").html("geology");
    }
    if(subject=="Mathematics"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Mathematics';
        setOptions(url);
        $$("#subjectNAme").html("Mathematics");
    }
        
    //and so on
    
        
   function setOptions(url){
 myApp.showIndicator();
        var temp_currentLoc=sessionStorage.getItem("newcurrentLoc");
    var loc = temp_currentLoc.substr(temp_currentLoc.lastIndexOf(' ') + 1); //take  everything after the space
       $$.ajax({
		url: url,
		  type: 'POST',
		  dataType: 'json',
          data: {
              location:loc
          },
          /*beforeSend: function(){
               myApp.showIndicator();
          },
          complete: function(){
             myApp.hideIndicator();
          },*/
		  success: displayJsonData,     
		  error: printerror
	});
       
    }
    
    function displayJsonData(myArr){
        
    if(myArr==null || myArr.length<=0){
    	alert("here");
    	$$("#display_scienceBookSbjt").empty();
	return;
    }

    errmsg = myArr[0].errmsg;
   // alert(errmsg);
    $$("#message").html(errmsg);

    /* sql =myArr[0].sql;
    $$("#message").html(sql);*/
    
    var row="";
    for(var i = 1; i < myArr.length; i++) {
        
       row += ' <li class="swipeout">';
       row += ' <div class="swipeout-content">';
     row += ' <a href="browseBook_Detail.html?bookID=' + myArr[i].bID +'" class="item-link item-content">';
        row += '<div class="item-media"><img src="php/' + myArr[i].imgSrc+'" width="80"></div>';
       row += ' <div class="item-inner">';
        row += '  <div class="item-title-row">';
            row += '<div class="item-title">' + myArr[i].bname +'</div>';
            row += '<div class="item-after">$' + myArr[i].price +'</div>';
          row += '</div>';
          row += '<div class="item-subtitle">' + myArr[i].sname +'</div>';
         row += ' <div class="item-text">' + myArr[i].notes +'</div>';
        row += '</div>';
     row += ' </a>';
      row += '  </div>';
  row += '<div class="swipeout-actions-right">';
    row += '  <a href="#" class="bg-blue addWish" data-id="' + myArr[i].bID +'">Add To WishList</a>';
 row += ' </div>';
  row += '  </li>';
        
        
    }
    //$$("#display_browseInfo").html(row);
     var element=document.getElementById('display_scienceBookSbjt');
        element.innerHTML = row;
    //alert(row);
     myApp.hideIndicator();
 $$('.addWish').on('click', function () {
      var bookID =  $$(this).data('id');
    //myApp.alert('added '+id); 
         
    var check=sessionStorage.getItem("stat");
    if(check=='false'){
            myApp.loginScreen();
         }
    else{
             $$.ajax({  //url: 172.16.1.69. "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
        url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   bookID:bookID
              },
		      success: function(result){
                 myApp.addNotification({
                  message: result[0].msg
                 });
		      }  
		   });
             
        }
         
         
    });   
    
}

 function printerror() {
    $$("#message").html("No book Posted on Sale yet");

  }
        
        
}); 
   
});

myApp.onPageInit('browseBusinessBooks', function (page) {
    var subject = page.query.subject;
    //myApp.alert(subject);
    
    $$(document).on('deviceready', function() {
    
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=business';
        setOptions(url);
        
   function setOptions(url){
 myApp.showIndicator();
        var temp_currentLoc=sessionStorage.getItem("newcurrentLoc");
    var loc = temp_currentLoc.substr(temp_currentLoc.lastIndexOf(' ') + 1); //take  everything after the space
       $$.ajax({
		url: url,
		  type: 'POST',
		  dataType: 'json',
          data: {
              location:loc
          },
          /*beforeSend: function(){
               myApp.showIndicator();
          },
          complete: function(){
             myApp.hideIndicator();
          },*/
		  success: displayJsonData,     
		  error: printerror
	});
       
    }
    
    function displayJsonData(myArr){
        
    if(myArr==null || myArr.length<=0){
    	alert("here");
    	$$("#display_businessBookSbjt").empty();
	return;
    }

    errmsg = myArr[0].errmsg;
   // alert(errmsg);
    $$("#message").html(errmsg);

    /* sql =myArr[0].sql;
    $$("#message").html(sql);*/
    
    var row="";
    for(var i = 1; i < myArr.length; i++) {
        
       row += ' <li class="swipeout">';
       row += ' <div class="swipeout-content">';
     row += ' <a href="browseBook_Detail.html?bookID=' + myArr[i].bID +'" class="item-link item-content">';
        row += '<div class="item-media"><img src="php/' + myArr[i].imgSrc+'" width="80"></div>';
       row += ' <div class="item-inner">';
        row += '  <div class="item-title-row">';
            row += '<div class="item-title">' + myArr[i].bname +'</div>';
            row += '<div class="item-after">$' + myArr[i].price +'</div>';
          row += '</div>';
          row += '<div class="item-subtitle">' + myArr[i].sname +'</div>';
         row += ' <div class="item-text">' + myArr[i].notes +'</div>';
        row += '</div>';
     row += ' </a>';
      row += '  </div>';
  row += '<div class="swipeout-actions-right">';
    row += '  <a href="#" class="bg-blue addWish" data-id="' + myArr[i].bID +'">Add To WishList</a>';
 row += ' </div>';
  row += '  </li>';
        
        
    }
    //$$("#display_browseInfo").html(row);
     var element=document.getElementById('display_businessBookSbjt');
        element.innerHTML = row;
    //alert(row);
     myApp.hideIndicator();
 $$('.addWish').on('click', function () {
      var bookID =  $$(this).data('id');
    //myApp.alert('added '+id); 
         
    var check=sessionStorage.getItem("stat");
    if(check=='false'){
            myApp.loginScreen();
         }
    else{
             $$.ajax({  //url: 172.16.1.69. "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
        url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   bookID:bookID
              },
		      success: function(result){
                 myApp.addNotification({
                  message: result[0].msg
                 });
		      }  
		   });
             
        }
         
         
    });   
    
}

 function printerror() {
	// myApp.alert("here");
    //$$("#message").html();
     
    // errmsg = myArr[0].errmsg;
    $$("#message").html("No book Posted on Sale yet");

  }
        
        
}); 
   
});


myApp.onPageInit('browseKinesiologyBooks', function (page) {
    var subject = page.query.subject;
    //myApp.alert(subject);
    
    $$(document).on('deviceready', function() {
    
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=kinesiology';
        setOptions(url);
        
   function setOptions(url){
 myApp.showIndicator();
        var temp_currentLoc=sessionStorage.getItem("newcurrentLoc");
    var loc = temp_currentLoc.substr(temp_currentLoc.lastIndexOf(' ') + 1); //take  everything after the space
       $$.ajax({
		url: url,
		  type: 'POST',
		  dataType: 'json',
          data: {
              location:loc
          },
          /*beforeSend: function(){
               myApp.showIndicator();
          },
          complete: function(){
             myApp.hideIndicator();
          },*/
		  success: displayJsonData,     
		  error: printerror
	});
       
    }
    
    function displayJsonData(myArr){
        
    if(myArr==null || myArr.length<=0){
    	alert("here");
    	$$("#display_kinesioBookSbjt").empty();
	return;
    }

    errmsg = myArr[0].errmsg;
   // alert(errmsg);
    $$("#message").html(errmsg);

    /* sql =myArr[0].sql;
    $$("#message").html(sql);*/
    
    var row="";
    for(var i = 1; i < myArr.length; i++) {
        
       row += ' <li class="swipeout">';
       row += ' <div class="swipeout-content">';
     row += ' <a href="browseBook_Detail.html?bookID=' + myArr[i].bID +'" class="item-link item-content">';
        row += '<div class="item-media"><img src="php/' + myArr[i].imgSrc+'" width="80"></div>';
       row += ' <div class="item-inner">';
        row += '  <div class="item-title-row">';
            row += '<div class="item-title">' + myArr[i].bname +'</div>';
            row += '<div class="item-after">$' + myArr[i].price +'</div>';
          row += '</div>';
          row += '<div class="item-subtitle">' + myArr[i].sname +'</div>';
         row += ' <div class="item-text">' + myArr[i].notes +'</div>';
        row += '</div>';
     row += ' </a>';
      row += '  </div>';
  row += '<div class="swipeout-actions-right">';
    row += '  <a href="#" class="bg-blue addWish" data-id="' + myArr[i].bID +'">Add To WishList</a>';
 row += ' </div>';
  row += '  </li>';
        
        
    }
    //$$("#display_browseInfo").html(row);
     var element=document.getElementById('display_kinesioBookSbjt');
        element.innerHTML = row;
    //alert(row);
     myApp.hideIndicator();
 $$('.addWish').on('click', function () {
      var bookID =  $$(this).data('id');
    //myApp.alert('added '+id); 
         
    var check=sessionStorage.getItem("stat");
    if(check=='false'){
            myApp.loginScreen();
         }
    else{
             $$.ajax({  //url: 172.16.1.69. "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
        url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   bookID:bookID
              },
		      success: function(result){
                 myApp.addNotification({
                  message: result[0].msg
                 });
		      }  
		   });
             
        }
         
         
    });   
    
}

 function printerror() {
	// myApp.alert("here");
    //$$("#message").html();
     
    // errmsg = myArr[0].errmsg;
    $$("#message").html("No book Posted on Sale yet");

  }
        
        
}); 
   
});


myApp.onPageInit('browseEngineerBooks', function (page) {
    var subject = page.query.subject;
    //myApp.alert(subject);
    
    $$(document).on('deviceready', function() {
    if(subject=="environmental"){
      var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=Environmental Systems';
        setOptions(url);
        $$("#subjectNAme").html("Environmental Systems Engineering");
    }
        
    if(subject=="electronic"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=electronic';
        setOptions(url);
         $$("#subjectNAme").html("Electronic Systems Engineering");
    }
    if(subject=="petroleum"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=petroleum';
        setOptions(url);
        $$("#subjectNAme").html("Petroleum Systems Engineering");
    }
        if(subject=="software"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=sofware';
        setOptions(url);
        $$("#subjectNAme").html("Software Systems Engineering");
    }
        if(subject=="industrial"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=industrial';
        setOptions(url);
        $$("#subjectNAme").html("Industrial Systems Engineering");
    }
        
    //and so on
    
        
   function setOptions(url){
 myApp.showIndicator();
        var temp_currentLoc=sessionStorage.getItem("newcurrentLoc");
    var loc = temp_currentLoc.substr(temp_currentLoc.lastIndexOf(' ') + 1); //take  everything after the space
       $$.ajax({
		url: url,
		  type: 'POST',
		  dataType: 'json',
          data: {
              location:loc
          },
          /*beforeSend: function(){
               myApp.showIndicator();
          },
          complete: function(){
             myApp.hideIndicator();
          },*/
		  success: displayJsonData,     
		  error: printerror
	});
       
    }
    
    function displayJsonData(myArr){
        
    if(myArr==null || myArr.length<=0){
    	alert("here");
    	$$("#display_engineerBookSbjt").empty();
	return;
    }

    errmsg = myArr[0].errmsg;
   // alert(errmsg);
    $$("#message").html(errmsg);

    /* sql =myArr[0].sql;
    $$("#message").html(sql);*/
    
    var row="";
    for(var i = 1; i < myArr.length; i++) {
        
       row += ' <li class="swipeout">';
       row += ' <div class="swipeout-content">';
     row += ' <a href="browseBook_Detail.html?bookID=' + myArr[i].bID +'" class="item-link item-content">';
        row += '<div class="item-media"><img src="php/' + myArr[i].imgSrc+'" width="80"></div>';
       row += ' <div class="item-inner">';
        row += '  <div class="item-title-row">';
            row += '<div class="item-title">' + myArr[i].bname +'</div>';
            row += '<div class="item-after">$' + myArr[i].price +'</div>';
          row += '</div>';
          row += '<div class="item-subtitle">' + myArr[i].sname +'</div>';
         row += ' <div class="item-text">' + myArr[i].notes +'</div>';
        row += '</div>';
     row += ' </a>';
      row += '  </div>';
  row += '<div class="swipeout-actions-right">';
    row += '  <a href="#" class="bg-blue addWish" data-id="' + myArr[i].bID +'">Add To WishList</a>';
 row += ' </div>';
  row += '  </li>';
        
        
    }
    //$$("#display_browseInfo").html(row);
     var element=document.getElementById('display_engineerBookSbjt');
        element.innerHTML = row;
    //alert(row);
     myApp.hideIndicator();
 $$('.addWish').on('click', function () {
      var bookID =  $$(this).data('id');
    //myApp.alert('added '+id); 
         
    var check=sessionStorage.getItem("stat");
    if(check=='false'){
            myApp.loginScreen();
         }
    else{
             $$.ajax({  //url: 172.16.1.69. "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
        url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   bookID:bookID
              },
		      success: function(result){
                 myApp.addNotification({
                  message: result[0].msg
                 });
		      }  
		   });
             
        }
         
         
    });   
    
}

 function printerror() {
	// myApp.alert("here");
    //$$("#message").html();
     
    // errmsg = myArr[0].errmsg;
    $$("#message").html("No book Posted on Sale yet");

  }
        
        
}); 
   
});

//on loading the page
myApp.onPageInit('browseMediaPerfBooks', function (page) {
    var subject = page.query.subject;
    //myApp.alert(subject);
    
    $$(document).on('deviceready', function() {
    if(subject=="creative"){
      var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=creative';
        setOptions(url);
        $$("#subjectNAme").html("creative technologies");
    }
        
    if(subject=="film"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=film';
        setOptions(url);
         $$("#subjectNAme").html("film");
    }
    if(subject=="music"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=music';
        setOptions(url);
        $$("#subjectNAme").html("music");
    }
        if(subject=="interdisciplinary"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=interdisciplinary';
        setOptions(url);
        $$("#subjectNAme").html("interdisciplinary Studies");
    }
        if(subject=="theatre"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=theatre';
        setOptions(url);
        $$("#subjectNAme").html("theatre");
    }
    if(subject=="visual"){
        var url ='http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?displayAllDeptBooks=yes&subjectName=visual';
        setOptions(url);
        $$("#subjectNAme").html("visual");
    }
        
    //and so on
    
        
   function setOptions(url){
 myApp.showIndicator();
        var temp_currentLoc=sessionStorage.getItem("newcurrentLoc");
    var loc = temp_currentLoc.substr(temp_currentLoc.lastIndexOf(' ') + 1); //take  everything after the space
       $$.ajax({
		url: url,
		  type: 'POST',
		  dataType: 'json',
          data: {
              location:loc
          },
          /*beforeSend: function(){
               myApp.showIndicator();
          },
          complete: function(){
             myApp.hideIndicator();
          },*/
		  success: displayJsonData,     
		  error: printerror
	});
       
    }
    
    function displayJsonData(myArr){
        
    if(myArr==null || myArr.length<=0){
    	alert("here");
    	$$("#display_mediaPerfBookSbjt").empty();
	return;
    }

    errmsg = myArr[0].errmsg;
   // alert(errmsg);
    $$("#message").html(errmsg);

    /* sql =myArr[0].sql;
    $$("#message").html(sql);*/
    
    var row="";
    for(var i = 1; i < myArr.length; i++) {
        
       row += ' <li class="swipeout">';
       row += ' <div class="swipeout-content">';
     row += ' <a href="browseBook_Detail.html?bookID=' + myArr[i].bID +'" class="item-link item-content">';
        row += '<div class="item-media"><img src="php/' + myArr[i].imgSrc+'" width="80"></div>';
       row += ' <div class="item-inner">';
        row += '  <div class="item-title-row">';
            row += '<div class="item-title">' + myArr[i].bname +'</div>';
            row += '<div class="item-after">$' + myArr[i].price +'</div>';
          row += '</div>';
          row += '<div class="item-subtitle">' + myArr[i].sname +'</div>';
         row += ' <div class="item-text">' + myArr[i].notes +'</div>';
        row += '</div>';
     row += ' </a>';
      row += '  </div>';
  row += '<div class="swipeout-actions-right">';
    row += '  <a href="#" class="bg-blue addWish" data-id="' + myArr[i].bID +'">Add To WishList</a>';
 row += ' </div>';
  row += '  </li>';
        
        
    }
    //$$("#display_browseInfo").html(row);
     var element=document.getElementById('display_mediaPerfBookSbjt');
        element.innerHTML = row;
    //alert(row);
     myApp.hideIndicator();
 $$('.addWish').on('click', function () {
      var bookID =  $$(this).data('id');
    //myApp.alert('added '+id); 
         
    var check=sessionStorage.getItem("stat");
    if(check=='false'){
            myApp.loginScreen();
         }
    else{
             $$.ajax({  
        url: "http://142.3.208.142/~okpalacollins4/mainProjectApp/www/php/logic.php?addWishlist=yes",
	  		 type: 'POST',
	  		dataType: 'json',
	  		data : {
	  			   bookID:bookID
              },
		      success: function(result){
                 myApp.addNotification({
                  message: result[0].msg
                 });
		      }  
		   });
             
        }
         
         
    });   
    
}

 function printerror() {
    $$("#message").html("No book Posted on Sale yet");

  }
        
        
}); 
   
});
