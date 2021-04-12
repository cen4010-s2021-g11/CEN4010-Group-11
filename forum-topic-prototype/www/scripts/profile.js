var currUser;
//var ref = db.collection("mentalHealthTopic");
var posts = [];
var email = document.querySelector("#email");
var userImage = document.querySelector("#userImage");

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);

        email.innerHTML = user.email;
        console.log(user.email);

        if (user.photoURL != undefined) {
            userImage.src = user.photoURL; 
        }

    } else {
        console.log("Error: no user found");
        window.location = "login.html";
    }
});