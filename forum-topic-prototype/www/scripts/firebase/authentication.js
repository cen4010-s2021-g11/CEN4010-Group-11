var currUser;
var emailForm = document.querySelector("#createEmail");
var usernameForm = document.querySelector("#createUsername");
var passwordForm = document.querySelector("#createPassword");
var confirmPasswordForm = document.querySelector("#confirmPassword");
 

document.querySelector("#loginUser").addEventListener("click", function() {
	login();
});

document.querySelector("#confirmCreate").addEventListener("click", function() {
	registerWithEmail();
});

document.querySelector("#googleLogin").addEventListener("click", function() {
    registerWithGoogle();
});

function registerWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            var credential = result.credential;
            var token = credential.accessToken;
            var user = result.user;
            upsertUser(result.user);
            $("#signInModal").modal("hide");
        })
        .catch((error) => {
            console.log(`${error.code}: ${error.message}`);
            document.getElementById("loginErrors").innerHTML = error.message;
        });
}

function registerWithEmail() {
    var email = emailForm.value;
    var username = usernameForm.value;
    var password = passwordForm.value;
    var confirmPassword = passwordForm.value;

    if(password == confirmPassword){
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            //login()

            // Upsert user to Firestore 
            var user = userCredential.user;
            console.log(username);
            user.updateProfile({
                displayName: username,
              }).then(function() {
                // Update successful.
                upsertUser(user);
                alert("Hey your account was created! Yay!");
                $("#createModal").modal("hide");
              }).catch(function(error) {
                // An error happened.
              });
        })
        .catch((error) => {
            alert(error.message);
            console.log(`${error.code}: ${error.message}`);
            document.getElementById("loginErrors").innerHTML = error.message;
        });
    }else{
        alert("Passwords do not match");
    }
    
}

function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log("signed in");
            console.log(user.email);
            $("#signInModal").modal("hide");
        })
        .catch((error) => {
            console.log(error.message);
            document.getElementById("loginErrors").innerHTML = error.message;
            document.getElementById("loginErrors").style.color = "red";
        });
}

function upsertUser(user) {
    db.collection("users").doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log(`User with email ${user.email} created!`);
        location.reload();
    })
    .catch((error) => {
        console.log(error.message);
    });
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        //console.log(user.displayName);
        currUser = user;
        document.getElementById("profileBtn").style.display = "block";
        document.getElementById("signInBtn").style.display = "none";
        document.getElementById("welcomeUser").innerHTML = "Welcome, " + user.displayName + " we're glad you're here!";
        document.getElementById("welcomeUser").style.display = "block";
    }
});
