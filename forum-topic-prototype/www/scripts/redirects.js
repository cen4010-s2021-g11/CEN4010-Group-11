document.querySelector("#introductions").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=introductions"
});

document.querySelector("#announcements").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=announcements"
});

document.querySelector("#mentalHealth").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=mentalHealth"
});


document.querySelector("#news").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=news"
});


document.querySelector("#vaccine").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=vaccine"
});


document.querySelector("#personal").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "topic.html?ref=personal"
})
