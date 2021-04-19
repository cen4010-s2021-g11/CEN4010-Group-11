document.querySelector("#introductions").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=introductions";
});

document.querySelector("#announcements").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=announcements";
});

document.querySelector("#mentalHealth").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=mentalHealth";
});

document.querySelector("#news").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=news";
});

document.querySelector("#vaccine").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=vaccine";
});

document.querySelector("#personal").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=personal";
});

document.querySelector("#profileBtn").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "profile.html?user=" + currUser.uid;
});

function goToProfile(e) {
    var postID = e.parentElement.parentElement.parentElement.id;
    var post = posts.find(post => post.id == postID);
    var ownerID = post.data().ownerID;
    if(ownerID) {
        window.location.href = "profile.html?user=" + post.data().ownerID;
    }
    else {
        db.collection("users").where("email", "==", post.data().owner).get()
            .then((snap) => {
                snap.forEach((doc) => {
                    window.location.href = "profile.html?user=" + doc.id;
                })
            })
            .catch((error) => {
                console.log(error);
            })
        //console.log("Found ref at:", ref.id);
        //alert("Uh oh! We could not find that user. Try clicking on a newer post.");
    }
}