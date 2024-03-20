// Get navbar.html
document.addEventListener("DOMContentLoaded", () => {
    fetch("/get-navbar")
        .then(response => response.text())
        .then(html => {
            document.getElementById("navContainer").innerHTML = html;
        })
        .catch(error => console.error("Error loading the navbar:", error));
});

// Get footer.html
document.addEventListener("DOMContentLoaded", () => {
    fetch("/get-footer")
        .then(response => response.text())
        .then(html => {
            document.getElementById("footerContainer").innerHTML = html;
        })
        .catch(error => console.error("Error loading the footer:", error));
});