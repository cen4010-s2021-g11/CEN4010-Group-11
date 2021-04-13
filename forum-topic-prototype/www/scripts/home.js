var totalPosts = 0;

var ref = db.collection('subforums')
ref.get().then((snapshot) => {
    const tempDoc = snapshot.docs.map((doc) => {
        console.log(doc.id+'Count')
        const numOfPosts = doc.data().numOfPosts;
        totalPosts+= numOfPosts ? numOfPosts : 0;
        document.getElementById(doc.id+'Count').innerHTML = numOfPosts ? numOfPosts : 0;
    });
    document.getElementById("totalPosts").innerHTML = `Total posts: ${totalPosts}`
})