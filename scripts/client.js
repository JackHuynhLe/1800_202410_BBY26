/**
 * The main JavaScript file for the Stardust.
 * */

/**
 * Function about loading page
 * */
{
    document.addEventListener("DOMContentLoaded", () => {
        /*
         * Fetches and injects HTML content into a specified container.
         * */
        function loadHTMLContent(containerId, htmlPath) {
            return fetch(htmlPath)
              .then(response => response.text())
              .then(html => {
                  document.getElementById(containerId).innerHTML = html;
              }).catch(error => console.error("Error loading HTML content:", error));
        }

        /**
         * To insert the bottom navbar and footer into each page,
         * and load the language file for it if exists.
         * */
        const bottomNavLoaded = loadHTMLContent("bottomNavContainer", "../text/bottom_navbar.html");
        const footerLoaded = loadHTMLContent("footerContainer", "../text/footer.html")

        Promise.all([bottomNavLoaded, footerLoaded]).then(() => {
            // Check if the preferred language is saved and change it if it is.
            const preferredLanguage = localStorage.getItem("preferredLanguage");
            if (preferredLanguage) {
                changeLanguage(preferredLanguage);
            }
        }).catch(error => console.error("Error initializing the page:", error));
    });
}
/**
 * Function about language selection
 * */
{
    document.addEventListener("DOMContentLoaded", () => {
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

        /**
         * Select language code
         * */
        document.body.addEventListener("click", function (event) {
            // Check if the clicked element is an interlanguage link
            if (event.target.matches(".interlanguage-link, .interlanguage-link *")) {
                const element = event.target.closest(".interlanguage-link");
                const selectedLanguageCode = element.getAttribute("data-code");
                changeLanguage(selectedLanguageCode);
            }
        });
    });
}
/**
 * Change the language based on the selected language.
 * */
{
    // Global variable to store current language strings
    let currentLanguageStrings = {};
    const preferredLanguage = localStorage.getItem("preferredLanguage");
    if (preferredLanguage) {
        changeLanguage(preferredLanguage);
        updateLangAttribute(preferredLanguage);
    }

    /**
     * Change the language JSON file
     * */
    function changeLanguage(language) {
        // Save the selected language
        window.localStorage.setItem("preferredLanguage", language);

        // Load the new language
        fetch(`../languages/${language}.json`)
          .then(response => response.json())
          .then(data => {
              // Store the loaded language strings
              currentLanguageStrings = data.Strings;
              // Update page content with the loaded language
              updatePageContent();
              // To update all placeholders
              updatePlaceholders();
              // Update the language attribute of the HTML element
              updateLangAttribute(language);
          })
          .catch(error => console.error("Error loading the language file:", error));
    }

    /**
     * Update the page content based on the current language strings
     * */
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

    /**
     * Function to retrieve localised strings
     * */
    function getLocalisedString(key) {
        return currentLanguageStrings[key] || `Missing localization for: ${key}`;
    }

    /**
     * Function to update the language attribute of the HTML element
     * @param language - The language code
     */
    function updateLangAttribute(language) {
        document.documentElement.lang = language;
    }
}
