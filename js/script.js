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
