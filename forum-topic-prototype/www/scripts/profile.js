var currUser;
var tempUser;
var email = document.querySelector("#email");
var username = document.querySelector("#displayNameInfo");
var userImage = document.querySelector("#userImage");
var firstNameDisplay = document.getElementById("displayFirstNameInfo");
var lastNameDisplay = document.getElementById("displayLastNameInfo");
var postCount = document.getElementById("postCount");
var path;
var postPath;
var currentTime = Math.floor(new Date().getTime() / 1000);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userIDPar = urlParams.get('user');

firebase.auth().onAuthStateChanged(function(user) {
    if(userIDPar && userIDPar != user.uid) {
        document.getElementById("editProfileBtn").style.display = "none";
        document.getElementById("signOutBtn").style.display = "none";
        getUser(userIDPar);
    }
    else {
        if (user) {
            currUser = user;
            username.innerHTML = currUser.displayName; 
            displayName.innerHTML = currUser.displayName;
            email.innerHTML = currUser.email;
            getUser(user.uid);
        } else { console.log("Error: no user found"); }
    }
});

function getUser(userid) {
    db.collection('users').doc(userid).get().then((doc) => {
        if (doc.exists) {
            tempUser = doc.data();
            username.innerHTML = doc.data().displayName;
            email.innerHTML = doc.data().email;

            var pic = document.getElementById("userImage");
            if (doc.data().profilePic == undefined || doc.data().profilePic == "") {
                pic.className = "profile-img img-responsive center-block";
                pic.classList.add("fa-user");
                pic.classList.add("fa");
                pic.classList.add("fa-5x");
            } else { 
                pic.className = "profile-img img-responsive center-block";
                pic.classList.add(doc.data().profilePic);
                pic.classList.add("fa");
                pic.classList.add("fa-5x");
            }

            document.getElementById("firstNameDiv").innerHTML = "First Name";
            if (doc.data().firstName == undefined || doc.data().firstName == "") {
                firstNameDisplay.innerHTML = "N/A";
            } else { 
                firstNameDisplay.innerHTML = doc.data().firstName; 
            }
            
            document.getElementById("lastNameDiv").innerHTML = "Last Name";
            if (doc.data().lastName == undefined || doc.data().lastName == "") {
                lastNameDisplay.innerHTML = "N/A";
            } else { 
                lastNameDisplay.innerHTML = doc.data().lastName; 
            }

            if (doc.data().posts == undefined) {
                postCount.innerHTML = "0 total posts";
            } else if (doc.data().posts.length == 1) {
                postCount.innerHTML = doc.data().posts.length + " total post"; 
            } else { 
                postCount.innerHTML = doc.data().posts.length + " total posts"; 
            }
            
            for (var i = 0; i < doc.data().posts.length; i++) {
                path = doc.data().posts[i]._delegate._key.path.segments
                postPath = path[5] + "/" + path[6] + "/" + path[7];
                topic = path[6];
                renderPostActivity(postPath, topic);
            }

        } else {
            //doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function renderPostActivity(postPath, topic) {
    var postActivity = document.getElementById("activityRow");
    
    db.collection(postPath).doc(path[8]).get()
    .then((doc) => {
        if (doc.exists) {
            const data = doc.data();

            var capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
            var postTime = Math.floor(data.createdAt.seconds);

            var clonePostActivity = postActivity.cloneNode(true);
            

            var rowTitle = document.getElementById("userActivity");
            var rowTimestamp = document.getElementById("timestamp");
            rowTitle.innerHTML = tempUser.displayName + " made a post in the <a href='topic.html?ref=" + topic + "'>" + capitalizedTopic + "</a> topic";
            
            rowTimestamp.innerHTML = elapsedTime(postTime);
            postActivity.after(clonePostActivity);
            postActivity.id = doc.id;
            postActivity.style.display = "table-row";
            //postActivity.style.display = "block" //hides model card
        } else {
            //doc.data() will be undefined in this case
            console.log("No such document!");
        }
            
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function elapsedTime(postTime) {
    var elapsed = currentTime - postTime;
    var sPerMinute = 60;
    var sPerHour = sPerMinute * 60;
    var sPerDay = sPerHour * 24;
    var sPerMonth = sPerDay * 30;
    var sPerYear = sPerDay * 365;

    if (elapsed < sPerMinute) {
        return(Math.floor(elapsed) + ' seconds ago');   
    }
    else if (elapsed < sPerHour) {
        if (elapsed == sPerMinute || elapsed < (sPerMinute * 2))
            return(Math.floor(elapsed/sPerMinute) + ' minute ago');
        else   
            return(Math.floor(elapsed/sPerMinute) + ' minutes ago');   
    }

    else if (elapsed < sPerDay) {
        if (elapsed == sPerHour || elapsed < (sPerHour * 2))
            return(Math.floor(elapsed/sPerHour) + ' hour ago');
        else
            return(Math.floor(elapsed/sPerHour) + ' hours ago');   
    }

    else if (elapsed < sPerMonth) {
        if (elapsed == sPerDay || elapsed < (sPerDay * 2))
            return('approximately ' + Math.floor(elapsed/sPerDay) + ' day ago');
        else 
            return('approximately ' + Math.floor(elapsed/sPerDay) + ' days ago');   
    }

    else if (elapsed < sPerYear) {
        if (elapsed == sPerMonth || elapsed < (sPerMonth * 2))
            return('approximately ' + Math.floor(elapsed/sPerMonth) + ' month ago');
        else 
            return('approximately ' + Math.floor(elapsed/sPerMonth) + ' months ago');
    }

    else {
        if (elapsed == sPerYear || elapsed < (sPerYear * 2))
            return('approximately ' + Math.floor(elapsed/sPerYear ) + ' year ago'); 
        else 
            return('approximately ' + Math.floor(elapsed/sPerYear ) + ' years ago'); 
    }
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

function setActive(elem){
    console.log(elem.id);
    console.log(document.getElementById("formPfp").classList);
    document.getElementById("formPfp").className = "";
    document.getElementById("formPfp").classList.add("fa");
    document.getElementById("formPfp").classList.add(elem.id);
    document.getElementById("formPfp").classList.add("fa-4x");
    console.log(document.getElementById("formPfp").classList[1]);
}