var currUser;
var email = document.querySelector("#email");
var userName = document.querySelector("#displayNameInfo");
var userImage = document.querySelector("#userImage");
var userID;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);


        db.collection('users').doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());

                document.getElementById("firstNameDiv").innerHTML = "First Name";
                if (doc.data().firstName == null) {
                    document.getElementById("displayFirstNameInfo").innerHTML = "";
                } else { document.getElementById("displayFirstNameInfo").innerHTML = doc.data().firstName; }
                
                document.getElementById("lastNameDiv").innerHTML = "Last Name";
                if (doc.data().lastName == null) {
                    document.getElementById("displayLastNameInfo").innerHTML = "";
                } else { document.getElementById("displayLastNameInfo").innerHTML = doc.data().lastName; }

                console.log(doc.data().posts[0]);

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });


        db.collection('users').doc(user.uid).get(GetOptions)

        email.innerHTML = user.email;
        userName.innerHTML = user.displayName;

        if (user.photoURL != undefined) {
            userImage.src = user.photoURL; 
        }

    } else {
        console.log("Error: no user found");
    }
});

function getPosts() {
    ref.collection('posts').orderBy('createdAt', 'asc').get()
        .then((doc) => {
            doc.forEach(doc => {
                posts.push(doc);
            });
            renderPosts();
        })
        .catch((error) => {
            console.log(error);
        });
}

function renderPosts() {
    var postActivity = document.getElementById("activityRow");
    //postElem.style.visibility = "hidden"

    posts.forEach(doc => {
        console.log(doc.data().posts);
        //const data = doc.data();
        //var clonePostElem = postElem.cloneNode(true);
        //clonePostElem.id = doc.id

        /*var cardTitle = document.getElementById("cardTitle");
        var cardText = document.getElementById("cardText");
        var cardUser = document.getElementById("cardUser");
        cardTitle.innerHTML = data.title;
        cardText.innerHTML = data.text;
        cardUser.innerHTML = data.owner;
        postElem.after(clonePostElem);
        postElem.style.display = "block" //hides model card*/
    })
}

document.querySelector("#signOutBtn").addEventListener("click", function() {
    firebase.auth().signOut().then(() => {
        console.log("Sign out successful...");
        alert("Thanks for stopping by!");
        window.location.href="home.html";
      }).catch((error) => {
        console.log(error.message);
    });
});