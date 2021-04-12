var emailForm = document.querySelector("#username");
var passwordForm = document.querySelector("#password");
 
document.querySelector("#emailLogin").addEventListener("click", function() {
	document.getElementById("signInByEmail").style.display = "inline";
});

document.querySelector("#loginUser").addEventListener("click", function() {
	login();
});

document.querySelector("#createUser").addEventListener("click", function() {
	document.getElementById("createUser").style.display = "inline";
	registerWithEmail();
});

document.querySelector("#googleLogin").addEventListener("click", function() {
    registerWithGoogle();
})

function registerWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            var credential = result.credential;
            var token = credential.accessToken;
            var user = result.user;
            upsertUser(result.user);
        })
        .catch((error) => {
            console.log(`${error.code}: ${error.message}`);
            document.getElementById("loginErrors").innerHTML = error.message;
        });
}

function registerWithEmail() {
    var email = emailForm.value;
    var password = passwordForm.value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            //login()

            // Upsert user to Firestore 
            const user = userCredential.user;
            console.log(user);
            upsertUser(user);

        })
        .catch((error) => {
            console.log(`${error.code}: ${error.message}`);
            document.getElementById("loginErrors").innerHTML = error.message;
        });
}

function login() {
    const email = emailForm.value;
    const password = passwordForm.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log("signed in");
            console.log(user.email);
        })
        .catch((error) => {
            console.log(error.message);
            document.getElementById("loginErrors").innerHTML = error.message;
        });
}

function upsertUser(user) {
    db.collection("users").doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log(`User with email ${user.email} created!`);
    })
    .catch((error) => {
        console.log(error.message);
    });
}



firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        window.location = "mental.html";
    }
});