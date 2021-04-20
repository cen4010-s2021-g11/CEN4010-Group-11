var currUser;
var currUserEmail = "";
var currPfp = "";
var posts = [];
var searchResults = [];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const topic = urlParams.get('ref');
var activePost;
const ref = db.collection('subforums').doc(topic);
const el = document.getElementById(topic);
el.setAttribute("class", el.getAttribute('class')+' active');

window.onload = function() {
    activePost = urlParams.get('post');
    if(activePost) {
        document.getElementsByClassName("commentIcon")[0].click();
        //document.getElementById("postCard").click();
    }
    getPosts();
}

document.querySelector("#search").addEventListener("click", function(e) {
    e.preventDefault();
    search();
});

document.querySelector("#cancelSearch").addEventListener("click", function(e) {
    e.preventDefault();
    this.style.display = "none";
    document.getElementById("search").style.display = "block";
    document.getElementById("searchBar").value = "";
    var searchPosts = document.getElementsByClassName("searchResult");
    while(searchPosts.length > 1) {
        searchPosts[0].parentNode.removeChild(searchPosts[0]);
    }
    location.reload();
});

ref.get()
    .then((doc) => {
        document.getElementById("title").innerHTML = doc.data().title;
        if(topic == "announcements"){
            if(currUserEmail != "akrause2017@fau.edu" && currUserEmail != "bque2018@fau.edu" 
               && currUserEmail != "ssoulard2018@fau.edu" && currUserEmail != "csalazar2018@fau.edu"
               && currUserEmail != "zgoldstein2018@fau.edu"){
                document.getElementById("newDiscussion").disabled = true;
                document.getElementById("newDiscussion").innerHTML = "ADMINS ONLY";
            }
        }
    }).catch((error) => {
        console.log("Error has occurred", error);
    })

    
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currUser = user;
        currUserEmail = user.email;
        //document.getElementById("user-info").innerHTML = user.email
        console.log(currUser.email);
        document.getElementById("profileBtn").style.display = "block";
        document.getElementById("signInBtn").style.display = "none";
        document.getElementById("welcomeUser").innerHTML = "Welcome, " + user.displayName + " we're glad you're here!";
        document.getElementById("welcomeUser").style.display = "block";

        db.collection('users').doc(currUser.uid).get().then((doc) => {
            if (doc.exists) {
                //console.log(doc.data().profilePic);
                if (doc.data().profilePic == undefined || doc.data().profilePic == "") {
                    currPfp = "fa-user";
                } else { 
                    currPfp = doc.data().profilePic;
                }
            } else {
                console.log("No such document!"); 
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    } else {
        console.log("Error: no user found");
    }
});

document.querySelector("#homeGlobe").addEventListener("click", function() {
	window.location.href = "home.html";
});

function createPost() {
    var postTitle = document.getElementById("threadTitle").value;
    var postText = document.getElementById("postText").value;

    if(currUserEmail != "" && currUser) {
        ref.collection('posts').add({
            title: postTitle,
            text: postText,
            owner: currUser.email,
            ownerID: currUser.uid,
            ownerPic: currPfp,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((post) => {
            alert("Post Successful! Thank you for your contribution to the DIVOC Forum");
            console.log("Document successfully written!");

            db.collection("users").doc(currUser.uid).update({
                posts: firebase.firestore.FieldValue.arrayUnion(post)
            }).catch((error) => {
                console.log(error);
            })

            ref.update({
                numOfPosts: firebase.firestore.FieldValue.increment(1)
            })
            analytics.logEvent('new_post', { topic: topic});
            location.reload();
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }else{
        alert("Please sign in to contribute to the forum!");
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
            document.getElementById("loading").style.display = "none";
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

        // if(currUser.photoURL) {
        //     document.getElementById("profile").src = currUser.photoURL;
        // }
        var cardTitle = document.getElementById("cardTitle");
        var cardText = document.getElementById("cardText");
        var cardUser = document.getElementById("cardUser");
        var cardTime = document.getElementById("postTime");
        var cardNumOfComments = document.getElementById("numOfComments");
        var cardNumOfLikes = document.getElementById("numOfLikes");
        var cardNumOfDislikes = document.getElementById("numOfDislikes");
        var cardPic = document.getElementById("userImage");

        cardPic.className = "mr-3 rounded-circle profIcon";
        if(data.ownerPic == "" || data.ownerPic == undefined){
            cardPic.classList.add("fa-user");
        }else{
            cardPic.classList.add(data.ownerPic);
        }
        cardPic.classList.add("fa");
        cardPic.classList.add("fa-2x");

        cardTitle.innerHTML = data.title;
        cardText.innerHTML = data.text;
        cardUser.innerHTML = data.owner;
        cardTime.innerHTML = timeSince(data.createdAt.toDate());
        cardNumOfComments.innerHTML = data.numOfComments ? data.numOfComments : 0;
        cardNumOfLikes.innerHTML = data.numOfLikes ? data.numOfLikes : 0;
        cardNumOfDislikes.innerHTML = data.numOfDislikes ? data.numOfDislikes : 0;
        postElem.after(clonePostElem);
        postElem.id = doc.id;
        postElem.style.display = "block"; //hides model card
    })
}

function search() {
    var text = document.getElementById("searchBar").value;
    console.log("value: ", text);
    console.log(posts.length);
    searchResults = [];
    posts.forEach((doc) => {
        const data = doc.data();
        if(data.title.toLowerCase().includes(text.toLowerCase()) || data.text.toLowerCase().includes(text.toLowerCase())) {
            searchResults.push(doc);
            console.log("matching: ", data.title)
        }
    })
    renderSearchResults();
}

function renderSearchResults() {
    console.log("rendering")
    var postElem = document.getElementById("postCard");
    var oldPosts = document.getElementsByClassName("post");
    document.getElementById("cancelSearch").style.display = "block";

    while(oldPosts.length > 1) {
        oldPosts[0].parentNode.removeChild(oldPosts[0]);
    }

    searchResults.forEach((doc) => {
        const data = doc.data();
        var clonePostElem = postElem.cloneNode(true);
        var cardTitle = document.getElementById("cardTitle");
        var cardText = document.getElementById("cardText");
        var cardUser = document.getElementById("cardUser");
        var cardTime = document.getElementById("postTime");
        var cardNumOfComments = document.getElementById("numOfComments");
        var cardNumOfLikes = document.getElementById("numOfLikes");
        var cardNumOfDislikes = document.getElementById("numOfDislikes");
        var cardPic = document.getElementById("userImage");

        cardPic.className = "mr-3 rounded-circle profIcon";
        console.log(data.ownerPic);
        if(data.ownerPic == "" || data.ownerPic == undefined){
            cardPic.classList.add("fa-user");
        }else{
            cardPic.classList.add(data.ownerPic);
        }
        cardPic.classList.add("fa");
        cardPic.classList.add("fa-2x");
        cardTitle.innerHTML = data.title;
        cardText.innerHTML = data.text;
        cardUser.innerHTML = data.owner;
        cardTime.innerHTML = timeSince(data.createdAt.toDate());
        cardNumOfComments.innerHTML = data.numOfComments ? data.numOfComments : 0;
        cardNumOfLikes.innerHTML = data.numOfLikes ? data.numOfLikes : 0;
        cardNumOfDislikes.innerHTML = data.numOfDislikes ? data.numOfDislikes : 0;
        postElem.after(clonePostElem);
        postElem.id = doc.id;
        postElem.classList.add("searchResult");
        postElem.style.display = "block"; //hides model card
        //document.getElementById("loadMore").style.display = "none";
    })
}


function timeSince(date) {
    var seconds = Math.floor((new Date() - date)/1000);
    var interval = seconds/31536000;
    if(interval>1) {
        const since = Math.floor(interval);
        return since == 1 ? since + " year ago" : since + " years ago";
    }

    interval = seconds / 2592000;
    if(interval>1) {
        const since = Math.floor(interval);
        return since == 1 ? since + " month ago" : since + " months ago";
    }

    interval = seconds/86400;
    if(interval > 1) {
        const since = Math.floor(interval)
        return since == 1 ? since + " day ago" : since + " days ago";
    }

    interval = seconds/3600;
    if(interval > 1) {
        const since = Math.floor(interval);
        return since == 1 ? since + " hour ago" : since + " hours ago";
    }

    interval = seconds / 60;
    if(interval > 1) {
        const since = Math.floor(interval);
        return since == 1 ? since + " minute ago" : since + " minutes ago";
    }
    const since = Math.floor(seconds);
    return since == 1 ? since + " second ago" : since + " seconds ago";
}