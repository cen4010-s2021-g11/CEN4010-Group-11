var currUser;
//var ref = db.collection("mentalHealthTopic");
var posts = [];
var email = document.querySelector("#email");
var userName = document.querySelector("#displayNameInfo");
var userImage = document.querySelector("#userImage");

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);

        email.innerHTML = user.email;
        userName.innerHTML = user.displayName;
        console.log(user.email);

        if (user.photoURL != undefined) {
            userImage.src = user.photoURL; 
        }

    } else {
        console.log("Error: no user found");
    }
});

document.querySelector("#signOutBtn").addEventListener("click", function() {
    firebase.auth().signOut().then(() => {
        console.log("Sign out successful...");
        alert("Thanks for stopping by!");
        window.location.href="home.html";
      }).catch((error) => {
        console.log(error.message);
    });
})