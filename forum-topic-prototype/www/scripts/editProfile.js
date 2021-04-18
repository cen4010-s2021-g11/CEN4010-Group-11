var firstName = document.getElementById("firstName");
var lastName = document.getElementById("lastName");

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currUser = user;
    } else {
        console.log("Error: no user found");
    }
});

document.getElementById("btnSave").addEventListener("click", function(){
    var firstnameInput = firstName.value;
    var lastNameInput = lastName.value;

    db.collection("users").doc(currUser.uid).update({
        firstName: firstnameInput,
        lastName: lastNameInput,
    })
    .then(() => {
        console.log("User information has been updated!");
        window.location.href = "profile.html";
    })
    .catch((error) => {
        console.log(error.message);
    });
});