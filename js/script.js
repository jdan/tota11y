var heading = document.querySelector(".heading");

// Add transitions to mobile devices by toggling a "touching" class on the
// banner
document.addEventListener("touchstart", function(e) {
    if (heading.classList.contains("touching")) {
        heading.classList.remove("touching");
    } else {
        heading.classList.add("touching");
    }
});

if (/chrome|safari/.test(navigator.userAgent.toLowerCase())) {
    // Load the bookmarklet
    var request = new XMLHttpRequest();
    request.open("GET", "./js/tota11y.min.js", true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var bookmarklet = "javascript:" + encodeURI(request.responseText);
            document.querySelector(".bookmarklet").href = bookmarklet;
        }
    };

    request.send();
} else {
    document.querySelector(".bookmarklet-container").style.display = "none";
}
