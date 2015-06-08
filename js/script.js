var heading = document.querySelector(".heading");

document.addEventListener("touchstart", function(e) {
    if (heading.classList.contains("touching")) {
        heading.classList.remove("touching");
    } else {
        heading.classList.add("touching");
    }
});
