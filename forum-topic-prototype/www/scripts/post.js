var currUser;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currUser = user;
        console.log(currUser.email);
    }else{
        console.log("error: no user found");
    }
});

var numCards;

var dbInfo = db.collection("mentalHealthTopic").doc("posts");
    dbInfo.get().then((doc) => {
        if (doc.exists) {
            var data = doc.data();
            numCards = data.numOfPosts;
            console.log(numCards);
            renderCards();
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });  

function renderCards(){
    console.log("num cards: " + numCards);
    for(var i = 1; i <= numCards; i++){
        console.log("num cards: " + numCards);
        console.log("i is: "+ i);
        addInfo(i);
    }
}

function addInfo(i){
    var dbInfo = db.collection("mentalHealthTopic").doc("post"+i);
        dbInfo.get().then((doc) => {
            if (doc.exists) {
                console.log(i);
                var data = doc.data();
                var dbText = data.text;
                var dbTitle = data.title;
                var dbUser = data.user;

                console.log("adding card: " + i);
                
                var postElem = document.getElementById("postCard");
                console.log("making clone of: " + "postCard");
                var clonePostElem = postElem.cloneNode(true);
                console.log("made clone");
                clonePostElem.id = "postCard" + i;
                clonePostElem.style.display = "block";
                console.log("set display");
                //clonePostElem.childNodes.item("cardTitle").innerHTML = dbTitle;
                //clonePostElem.childNodes.item("cardText").innerHTML = dbText;
                var cardTitle = document.getElementById("cardTitle");
                var cardText = document.getElementById("cardText");
                var cardUser = document.getElementById("cardUser");
                cardTitle.innerHTML = dbTitle;
                cardText.innerHTML = dbText;
                cardUser.innerHTML = dbUser;
                console.log(dbText);
                postElem.after(clonePostElem);
                console.log("inserted");

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        }); 
        
}

function makePost(){
    var numPosts;
    var postID;
    
    var dbInfo = db.collection("mentalHealthTopic").doc("posts");
    dbInfo.get().then((doc) => {
        if (doc.exists) {
            var data = doc.data();
            numPosts = data.numOfPosts;
            numPosts++;
            postID = "post" + numPosts;
            console.log(postID);
            newEntry(postID, numPosts);
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });  

}

function newEntry(postID, numPosts){
    var postTitle = document.getElementById("threadTitle").value;
    var postText = document.getElementById("postText").value;
    console.log(postID);
    db.collection("mentalHealthTopic").doc(postID).set({
        title: postTitle,
        text: postText,
        user: currUser.email
    }).then(() => {
        //alert("Document successfully written!");
        console.log("Document successfully written!");
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });

    db.collection(currUser.email).doc(postTitle).set({
        title: postTitle,
        text: postText,
        topic: "mental health"
    }).then(() => {
        //alert("Document successfully written!");
        console.log("Document successfully written!");
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });

    db.collection("mentalHealthTopic").doc("posts").set({
        numOfPosts: numPosts++
        
    }).then(() => {
        //alert("Document successfully written!");
        console.log("Document successfully written!");
        alert("Post Successful! Thank you for your contribution to the DIVOC Forum");
        window.location.href = "mental.html";
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });

    
}