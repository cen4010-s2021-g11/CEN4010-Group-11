var currUser;
var currUserEmail;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currUser = user;
        currUserEmail = user.email;
        renderUserLikes();
        renderUserDislikes();
    } else {
        currUserEmail = " ";
        console.log("Error: no user found");
    }
});

function getActionLike(elem){
    if(currUser){
        var dislikeBtn = elem.nextSibling.nextSibling.nextSibling.nextSibling;
        if(dislikeBtn.classList.contains("alreadyDisliked")){
            undoDislike(elem);
        }
        if(elem.classList.contains("alreadyLiked")){
            unlike(elem);
        }else{
            addLike(elem);
        }
    }else{
        alert("Please sign in to use this feature.");
    }
    
}

function getActionDislike(elem){
    if(currUser){
        var likeBtn = elem.previousSibling.previousSibling.previousSibling.previousSibling;
        if(likeBtn.classList.contains("alreadyLiked")){
            unlike(elem);
        }
        if(elem.classList.contains("alreadyDisliked")){
            undoDislike(elem);
        }else{
            addDislike(elem);
        }
    }else{
        alert("Please sign in to use this feature.");
    }
    
}

function addLike(elem){
    var postID = elem.parentNode.parentNode.parentNode.parentNode.id;
    ref.collection('posts').doc(postID).update({
        numOfLikes: firebase.firestore.FieldValue.increment(1)
    })
    .then(() => {
        db.collection("users").doc(currUser.uid).update({
            likes: firebase.firestore.FieldValue.arrayUnion(postID)
        }).catch((error) => {
            alert(error);
            console.log(error);
        })
        updateUI(postID, "like");
    })
    .catch((error) => {
        alert("An error has occured.");
        console.log(error);
    })
}

function addDislike(elem){
    var postID = elem.parentNode.parentNode.parentNode.parentNode.id;
    ref.collection('posts').doc(postID).update({
        numOfDislikes: firebase.firestore.FieldValue.increment(1)
    })
    .then(() => {
        db.collection("users").doc(currUser.uid).update({
            dislikes: firebase.firestore.FieldValue.arrayUnion(postID)
        }).catch((error) => {
            alert(error);
            console.log(error);
        })
        updateUI(postID, "dislike");
    })
    .catch((error) => {
        alert("An error has occured.");
        console.log(error);
    })
}

function updateUI(postID, action){
    var post = document.getElementById(postID);
    var likeBtn = post.childNodes.item(1).childNodes.item(1).childNodes.item(5).childNodes.item(11);
    var dislikeBtn = post.childNodes.item(1).childNodes.item(1).childNodes.item(5).childNodes.item(15);
    var numLikes = post.childNodes.item(1).childNodes.item(1).childNodes.item(5).childNodes.item(9);
    var currLikes = numLikes.innerHTML;
    var numDislikes = post.childNodes.item(1).childNodes.item(1).childNodes.item(5).childNodes.item(13);
    var currDislikes = numDislikes.innerHTML;
    if(action == "like"){
        currLikes++;
        numLikes.innerHTML = currLikes;
        likeBtn.style.color = "green";
        likeBtn.classList.remove("thumbIcon");
        likeBtn.classList.add("alreadyLiked");
    }
    if(action == "unlike"){
        currLikes--;
        numLikes.innerHTML = currLikes;
        likeBtn.style.color = "black";
        likeBtn.classList.add("thumbIcon");
        likeBtn.classList.remove("alreadyLiked");
    }
    if(action == "dislike"){
        currDislikes++;
        numDislikes.innerHTML = currDislikes;
        dislikeBtn.style.color = "red";
        dislikeBtn.classList.remove("thumbIcon");
        dislikeBtn.classList.add("alreadyDisliked");
    }
    if(action == "undo dislike"){
        currDislikes--;
        numDislikes.innerHTML = currDislikes;
        dislikeBtn.style.color = "black";
        dislikeBtn.classList.add("thumbIcon");
        dislikeBtn.classList.remove("alreadyDisliked");
    }
}

function renderUserLikes(){
    db.collection("users").doc(currUser.uid).get()
    .then((doc) => {
        if(doc.exists){
            var data = doc.data();
            for(var i = 0; i<data.likes.length; i++){
                var likedPost = document.getElementById(data.likes[i]);
                if(likedPost != null){
                    var button = likedPost.childNodes.item(1).childNodes.item(1).childNodes.item(5).childNodes.item(11);
                    button.classList.remove("thumbIcon");
                    button.classList.add("alreadyLiked");
                }else{
                }
                
            }
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

function unlike(elem){
    var postID = elem.parentNode.parentNode.parentNode.parentNode.id;
    ref.collection('posts').doc(postID).update({
        numOfLikes: firebase.firestore.FieldValue.increment(-1)
    })
    .then(() => {
        db.collection("users").doc(currUser.uid).update({
            likes: firebase.firestore.FieldValue.arrayRemove(postID)
        }).catch((error) => {
            alert(error);
            console.log(error);
        })
        updateUI(postID, "unlike");
    })
    .catch((error) => {
        alert("An error has occurred!");
        console.log(error);
    })
}

function undoDislike(elem){
    var postID = elem.parentNode.parentNode.parentNode.parentNode.id;
    ref.collection('posts').doc(postID).update({
        numOfDislikes: firebase.firestore.FieldValue.increment(-1)
    })
    .then(() => {
        db.collection("users").doc(currUser.uid).update({
            dislikes: firebase.firestore.FieldValue.arrayRemove(postID)
        }).catch((error) => {
            alert(error);
            console.log(error);
        })
        updateUI(postID, "undo dislike");
    })
    .catch((error) => {
        alert("An error has occurred!");
        console.log(error);
    })
}

function renderUserDislikes(){
    db.collection("users").doc(currUser.uid).get()
    .then((doc) => {
        if(doc.exists){
            var data = doc.data();
            for(var i = 0; i<data.dislikes.length; i++){
                var disliked = document.getElementById(data.dislikes[i]);
                if(disliked != null){
                    var button = disliked.childNodes.item(1).childNodes.item(1).childNodes.item(5).childNodes.item(15);
                    button.classList.remove("thumbIcon");
                    button.classList.add("alreadyDisliked");
                }
            }
        }
    })
    .catch((error) => {
        console.log(error);
    });
}
