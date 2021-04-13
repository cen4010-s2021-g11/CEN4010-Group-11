var currUser;
var currUserEmail = "";
var posts = [];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const topic = urlParams.get('ref')
const ref = db.collection('subforums').doc(topic);
const el = document.getElementById(topic);
el.setAttribute("class", el.getAttribute('class')+' active');

ref.get()
    .then((doc) => {
        document.getElementById("title").innerHTML = doc.data().title;
    }).catch((error) => {
        console.log("Error has occurred", error);
    })

    
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currUser = user;
        currUserEmail = user.email;
        console.log(user);
        //document.getElementById("user-info").innerHTML = user.email
        console.log(currUser.email);
        document.getElementById("profileBtn").style.display = "block";
        document.getElementById("signInBtn").style.display = "none";
        document.getElementById("welcomeUser").innerHTML = "Welcome, " + user.displayName + " we're glad you're here!";
        document.getElementById("welcomeUser").style.display = "block";
    } else {
        console.log("Error: no user found");
    }
});

document.querySelector("#homeGlobe").addEventListener("click", function() {
	window.location.href = "home.html";
});

window.onload = function() {
    getPosts();
}

function createPost() {
    var postTitle = document.getElementById("threadTitle").value;
    var postText = document.getElementById("postText").value;

    if(currUserEmail != ""){
        ref.collection('posts').add({
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

            ref.update({
                numOfPosts: firebase.firestore.FieldValue.increment(1)
            })

            location.reload();
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }else{
        alert("Hey bud, please sign in to contribute to the forum!");
        $("#threadModal").modal("hide");
    }
    
}

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
    var postElem = document.getElementById("postCard");
    //postElem.style.visibility = "hidden"

    posts.forEach(doc => {
        const data = doc.data();
        var clonePostElem = postElem.cloneNode(true);
        clonePostElem.id = doc.id

        var cardTitle = document.getElementById("cardTitle");
        var cardText = document.getElementById("cardText");
        var cardUser = document.getElementById("cardUser");
        cardTitle.innerHTML = data.title;
        cardText.innerHTML = data.text;
        cardUser.innerHTML = data.owner;
        postElem.after(clonePostElem);
        postElem.style.display = "block" //hides model card
    })
}


