var firstName = document.getElementById("firstName");
var lastName = document.getElementById("lastName");
var instagram = document.getElementById("instagram");
var twitter = document.getElementById("twitter");
var facebook = document.getElementById("facebook");

document.getElementById("btnSave").addEventListener("click", function(){
    var firstnameInput = firstName.value;
    var lastNameInput = lastName.value;
    var instagramInput = instagram.value;
    var twitterInput = twitter.value;
    var facebookInput = facebook.value;

    db.collection("users").doc(user.uid).set({
        firstName: firstnameInput,
        lastName: lastNameInput,
        instagram: instagramInput,
        twitter: twitterInput,
        facebook: facebookInput
    })
    .then(() => {
        console.log("User information has been updated!");
    })
    .catch((error) => {
        console.log(error.message);
    });

    window.location.href = "profile.html";
});