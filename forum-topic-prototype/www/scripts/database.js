var googleLoginBtn = document.querySelector("#googleLogin");
var loginBtn = document.querySelector("#loginUser");
var createBtn = document.querySelector("#createAccount");
var createUserBtn = document.querySelector("#createUser");
var emailLoginBtn = document.querySelector("#emailLogin");
var viewProfile = document.querySelector("profile");

var usernameLogin = document.querySelector("#username");
var passwordLogin = document.querySelector("#password");
var username, password;

//Ids of user info stored in variables for easy use on multiple login methods
var email = document.querySelector("#email");
var displayName = document.querySelector("#displayName");
var userImage = document.querySelector("#userImage");

googleLoginBtn.addEventListener("click", function() {
		
	if (!firebase.auth().currentUser) {
		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
		.then(function() {
			//Set the auth provider to Google
			var provider = new firebase.auth.GoogleAuthProvider();
			//And sign in with a popup
			firebase.auth().signInWithPopup(provider)
			.then(function(result) { //On success save the token to session storage and output it to console
				var token = result.credential.accessToken;
				window.sessionStorage.setItem("token", token);
				console.log(result);
				var user = result.user;
				console.log(user);
				initApp();
		}).catch(function (error) { //On failure alert user or report error to console
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;
			if (errorCode === 'auth/account-exists-with-different-credential') {
				alert('You have already signed up with a different auth provider for that email.');
			} else {
				console.error(errorMessage);
			}
		});
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
		});
	} else {
    	firebase.auth().signOut();
	}
	
	/*//If the current user object does not exist
  	if (!firebase.auth().currentUser) {
    	//Set the auth provider to Google
    	var provider = new firebase.auth.GoogleAuthProvider();
    	//And sign in with a popup
    	firebase.auth().signInWithPopup(provider)
      	.then(function(result) { //On success save the token to session storage and output it to console
        	var token = result.credential.accessToken;
        	window.sessionStorage.setItem("token", token);
        	console.log(result);
        	var user = result.user;
			console.log(user);
			initApp();
			
     	}).catch(function (error) { //On failure alert user or report error to console
        	var errorCode = error.code;
        	var errorMessage = error.message;
        	var email = error.email;
        	var credential = error.credential;
        	if (errorCode === 'auth/account-exists-with-different-credential') {
        		alert('You have already signed up with a different auth provider for that email.');
        	} else {
          		console.error(errorMessage);
        	}
      	});
  	} else {
    	firebase.auth().signOut();
	}*/
});

emailLoginBtn.addEventListener("click", function() {
	document.getElementById("signInByEmail").style.display = "inline";
	create();
	login();
});

function login() {
	loginBtn.addEventListener("click", function() {
		username = usernameLogin.value;
		password = passwordLogin.value;

		firebase.auth().signInWithEmailAndPassword(username, password)
		.then(function(userCredential) {
			var user = userCredential.user;
			console.log(userCredential);
			initApp();
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			
			//if user password is incorrect
			if(errorCode == 'auth/wrong-password') {
				passwordLogin.value = "";
				document.getElementById("loginErrors").innerHTML = "Password is incorrect. Please try again.";
				console.log("Password is incorrect. Please try again.");
			//if user logins with account that does not exist
			} else if(errorCode == 'auth/user-not-found') {
				document.getElementById("loginErrors").innerHTML = "Username is incorrect. Please try again.";
				console.log("Username is incorrect. Please try again.");
			}
		});
	});
}

function create() {
	createUserBtn.addEventListener("click", function() {
		username = usernameLogin.value;
		password = passwordLogin.value;
				
		firebase.auth().createUserWithEmailAndPassword(username, password)
		.then(function(userCredential) {
			var user = userCredential.user;
			console.log("User has been created");
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			
			//if user creates an account with an email already in use
			if(errorCode == 'auth/email-already-in-use') {
				document.getElementById("loginErrors").innerHTML = "Email is already in use. Please use a different email if you are creating a new account";
				
				console.log("Email is already in use. Please use a different email if you are creating a new account");
				
			//if user inputs an invalid email
			} else if(errorCode == 'auth/invalid-email') {
				document.getElementById("loginErrors").innerHTML = "Email is invalid. Please try again";
				
				console.log("Email is invalid. Please try again");
				
			//if user creates a weak password
			} else if(errorCode == 'auth/weak-password') {				
				document.getElementById("loginErrors").innerHTML = "This password is too weak. Your password should be at least 6 characters";
				
				console.log("This password is too weak. Your password should be at least 6 characters");
			}
		});
	});
}

function initApp() {
  //Set listeners for Auth State Changed
  firebase.auth().onAuthStateChanged(function(user) {
	  if (user) { //if there is a user enable app functionality
		  //hide username and password input
		  //document.getElementById("signInByEmail").style.display = "none";
		  //document.getElementById("signedIn").style.display = "inline";
		  
		  var userEmail = user.email;
		  console.log(userEmail);
		  
		  email.innerHTML = user.email;
		  if (user.displayName != undefined) { displayName.innerHTML = user.displayName; }
		  
		  if (user.photoURL != undefined) { userImage.src = user.photoURL; }
		  
		  googleLoginBtn.innerHTML = 'Sign out';
		  
		  userDatabase(userEmail);
      //else keep the app disabled or re-disabled it
	  } else {
		  googleLoginBtn.innerHTML = 'Sign in with <i class="fab fa-google"></i>';
		  document.getElementById("signedIn").style.display = "none";
		  document.getElementById("signInByEmail").style.display = "inline";
		  usernameLogin.value = "";
		  passwordLogin.value = "";
	  }
  });
}

function goToTopic(){
    window.location.href = "mental.html";
}
