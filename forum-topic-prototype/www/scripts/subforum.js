var currUser;
var ref = db.collection("mentalHealthTopic");
var posts = [];

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currUser = user;
        console.log(user);
        document.getElementById("user-info").innerHTML = user.email
        console.log(currUser.email);
    } else {
        console.log("Error: no user found");
        window.location = "login.html";
    }
});

window.onload = function() {
    getPosts();
}

document.querySelector("#signout").addEventListener("click", function() {
    firebase.auth().signOut().then(() => {
        console.log("Sign out successful...");
      }).catch((error) => {
        console.log(error.message);
      });
})

function createPost() {
    var postTitle = document.getElementById("threadTitle").value;
    var postText = document.getElementById("postText").value;

    ref.add({
        title: postTitle,
        text: postText,
        owner: currUser.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((post) => {
        alert("Post Successful! Thank you for your contribution to the DIVOC Forum");
        console.log("Document successfully written!");

        db.collection("users").doc(currUser.uid).update({
            posts: firebase.firestore.FieldValue.arrayUnion(post)
        })

        location.reload();
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}

function getPosts() {
    ref.orderBy('createdAt', 'asc').get()
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
    var postElem = document.getElementById("postCard");

    posts.forEach(doc => {
        const data = doc.data();
        var clonePostElem = postElem.cloneNode(true);
        clonePostElem.id = doc.id
        clonePostElem.style.display = "block";

        var cardTitle = document.getElementById("cardTitle");
        var cardText = document.getElementById("cardText");
        var cardUser = document.getElementById("cardUser");
        cardTitle.innerHTML = data.title;
        cardText.innerHTML = data.text;
        cardUser.innerHTML = data.owner;
        postElem.after(clonePostElem);
    })
}


