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
    var pfp = document.getElementById("formPfp").classList[1];
    if(pfp == undefined){
        pfp = "fa-user";
    }
    console.log(pfp);

    db.collection("users").doc(currUser.uid).update({
        firstName: firstnameInput,
        lastName: lastNameInput,
        profilePic: pfp,
    })
    .then(() => {
        console.log("User information has been updated!");
        db.collection("users").doc(currUser.uid).get()
        .then((doc) => {
            if(doc.exists){
                var data = doc.data();
                if(data.posts) { 
                    for(var i = 0; i<data.posts.length; i++){
                        var ref = data.posts[i];
                        ref.update({
                            ownerPic: pfp,
                        }).then(() =>{
                            console.log("saved pfp");
                        }).catch((error) => {
                            console.log("Error getting document:", error);
                        });
                    }
                }
            }
            window.location.href = "profile.html";
        })
        .catch((error) => {
            console.log(error);
        });
    })
    .catch((error) => {
        console.log(error.message);
    });
});