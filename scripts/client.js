/*HTML
* */

document.addEventListener("DOMContentLoaded", () => {
  // Get bottom_navbar.html
  fetch("../text/bottom_navbar.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("bottomNavContainer").innerHTML = html;
    })
    .catch(error => console.error("Error loading the bottom navbar:", error));

// Get footer.html
  fetch("../text/footer.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("footerContainer").innerHTML = html;
    })
    .catch(error => console.error("Error loading the footer:", error));

});
/*Footer
* */

// Language selection
document.getElementById("footerContainer").addEventListener("click", () => {
  const languageList = document.getElementById("language-list")

  if (languageList.style.display === "none") {
    languageList.style.display = "flex";
  } else {
    languageList.style.display = "none";
  }
});

// Change language
// Check if the preferred language is saved
const preferredLanguage = localStorage.getItem("preferredLanguage");
if (preferredLanguage) {
  changeLanguage(preferredLanguage);
}

function changeLanguage(language) {
  // Save the selected language
  window.localStorage.setItem("preferredLanguage", language);

  // Load the new language
  fetch(`../languages/${language}.json`)
    .then(response => response.json())
    .then(data => {
      let strings = data.Strings;
      document.querySelectorAll(".lang-text").forEach(element => {
        let key = element.getAttribute("data-key");
        // Check if the key exists in the strings object
        if (key in strings) {
          // Set the text content of the element
          element.textContent = strings[key];
        }
      });
    })
    .catch(error => console.error("Error loading the language file:", error));
}

document.body.addEventListener("click", function (event) {
  // Check if the clicked element is an interlanguage link
  if (event.target.matches(".interlanguage-link, .interlanguage-link *")) {
    const element = event.target.closest(".interlanguage-link");
    const selectedLanguageCode = element.getAttribute("data-code");
    changeLanguage(selectedLanguageCode);
  }
});