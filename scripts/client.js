/**
 * The main JavaScript file for the Stardust.
 * */

// Function to retrieve localised strings with fallback
function getLocalisedString(key) {
    // Wait for the currentLanguageStrings to be loaded
    if (window.currentLanguageStrings && key in window.currentLanguageStrings) {
        return window.currentLanguageStrings[key];
    } else {
        // Fallback to English or a default message before the language files are loaded
        return `Loading...`;
    }
}

/**
 * Function about loading page
 * */
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
    const footerLoaded = loadHTMLContent("footerContainer", "../text/footer.html");

    Promise.all([bottomNavLoaded, footerLoaded]).then(() => {
        // Check if the preferred language is saved and change it if it is.
        const preferredLanguage = localStorage.getItem("preferredLanguage") || 'en-UK'; // Default to 'en-UK' if not set
        changeLanguage(preferredLanguage);
    }).catch(error => console.error("Error initializing the page:", error));
});

/**
 * Change the language based on the selected language.
 * */
{
    // Global variable to store current language strings
    window.currentLanguageStrings = {};

    function changeLanguage(language) {
        // Save the selected language
        window.localStorage.setItem("preferredLanguage", language);

        // Load the new language
        fetch(`../languages/${language}.json`)
            .then(response => response.json())
            .then(data => {
                // Store the loaded language strings
                window.currentLanguageStrings = data.Strings;
                // Update page content with the loaded language
                updatePageContent();
                // To update all placeholders
                updatePlaceholders();
                // Update the language attribute of the HTML element
                updateLangAttribute(language);
            })
            .catch(error => console.error("Error loading the language file:", error));
    }

    function updatePageContent() {
        document.querySelectorAll(".lang-text").forEach(element => {
            const key = element.getAttribute("data-key");
            if (key in window.currentLanguageStrings) {
                element.textContent = window.currentLanguageStrings[key];
            }
        });
    }

    function updatePlaceholders() {
        document.querySelectorAll('input[data-key]').forEach(input => {
            const key = input.getAttribute('data-key');
            if (key && key in window.currentLanguageStrings) {
                input.placeholder = window.currentLanguageStrings[key];
            }
        });
    }

    function updateLangAttribute(language) {
        document.documentElement.lang = language;
    }
}

// Event listeners for language selection
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("footerContainer").addEventListener("click", () => {
        const languageList = document.getElementById("language-list");
        languageList.style.display = languageList.style.display === "none" ? "flex" : "none";
    });

    document.body.addEventListener("click", function (event) {
        if (event.target.matches(".interlanguage-link, .interlanguage-link *")) {
            const element = event.target.closest(".interlanguage-link");
            const selectedLanguageCode = element.getAttribute("data-code");
            changeLanguage(selectedLanguageCode);
        }
    });
});
/**
 * Interactive of the page.
 */
{
    /**
     * Interactive of the history page.
     * */
    document.addEventListener("DOMContentLoaded", () => {
        function toggleDisplay(elementToShow, elementToHide) {
            elementToShow.style.display = elementToShow.style.display === "flex" ? "none" : "flex";
            elementToHide.style.display = "none";
        }

        const travelHistoryContainer = document.getElementById("travelHistoryContainer");
        const communityHistoryContainer = document.getElementById("communityHistoryContainer");

        document.getElementById("travelHistoryBtn").addEventListener("click", () => {
            toggleDisplay(travelHistoryContainer, communityHistoryContainer);
        });

        document.getElementById("communityHistoryBtn").addEventListener("click", () => {
            toggleDisplay(communityHistoryContainer, travelHistoryContainer);
        });
    });
}
