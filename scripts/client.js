/*HTML
* */

/**
 * To insert the bottom navbar and footer into each page,
 * and load the language file for it if exists.
 * */
document.addEventListener("DOMContentLoaded", () => {
    let bottomNavLoaded = fetch("../text/bottom_navbar.html")
      .then(response => response.text())
      .then(html => {
          document.getElementById("bottomNavContainer").innerHTML = html;
      });

    let footerLoaded = fetch("../text/footer.html")
      .then(response => response.text())
      .then(html => {
          document.getElementById("footerContainer").innerHTML = html;
      });

    Promise.all([bottomNavLoaded, footerLoaded]).then(() => {
        // Check if the preferred language is saved and change it if it is.
        const preferredLanguage = localStorage.getItem("preferredLanguage");
        if (preferredLanguage) {
            changeLanguage(preferredLanguage);
        }
    }).catch(error => console.error("Error initializing the page:", error));
});

/*Footer
* */

/**
 * To display the language list when the user clicks on the language button.
 * */
document.getElementById("footerContainer").addEventListener("click", () => {
    const languageList = document.getElementById("language-list")

    if (languageList.style.display === "none") {
        languageList.style.display = "flex";
    } else {
        languageList.style.display = "none";
    }
});

// Global variable to store current language strings
let currentLanguageStrings = {};

/**
 * Change the language based on the selected language.
 * */
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
          currentLanguageStrings = data.Strings; // Store the loaded language strings
          updatePageContent(); // Update page content with the loaded language
          updatePlaceholders(); // New function to update all placeholders
      })
      .catch(error => console.error("Error loading the language file:", error));
}

// Update the page content based on the current language strings
function updatePageContent() {
    document.querySelectorAll(".lang-text").forEach(element => {
        const key = element.getAttribute("data-key");
        if (key in currentLanguageStrings) {
            element.textContent = currentLanguageStrings[key];
        }
    });
}

/**
 * To update placeholders for all input elements with a data-key attribute
 * */
function updatePlaceholders() {
    document.querySelectorAll('input[data-key]').forEach(input => {
        const key = input.getAttribute('data-key');
        if (key && key in currentLanguageStrings) {
            input.placeholder = currentLanguageStrings[key];
        }
    });
}

document.body.addEventListener("click", function (event) {
    // Check if the clicked element is an interlanguage link
    if (event.target.matches(".interlanguage-link, .interlanguage-link *")) {
        const element = event.target.closest(".interlanguage-link");
        const selectedLanguageCode = element.getAttribute("data-code");
        changeLanguage(selectedLanguageCode);
    }
});

/**
 * Function to retrieve localised strings
 * */
function getLocalisedString(key) {
    return currentLanguageStrings[key] || `Missing localization for: ${key}`;
}
