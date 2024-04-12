/**
 * The main JavaScript file for the Stardust.
 * */

/**
 * Function about loading page.
 * */
{
    /**
     * Function to change the language and load the HTML content.
     */
    document.addEventListener("DOMContentLoaded", () => {
        /**
         * Fetches and injects HTML content into a specified container.
         *
         * @param {string} containerId - The ID of the container
         * @param {string} htmlPath - The path of the HTML file
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
         *
         * @param {string} preferredLanguage - The preferred language
         * */
        const bottomNavLoaded = loadHTMLContent("bottomNavContainer", "../text/bottom_navbar.html");
        const footerLoaded = loadHTMLContent("footerContainer", "../text/footer.html");

        Promise.all([bottomNavLoaded, footerLoaded]).then(() => {
            /**
             * Because we don't have a footer (language btn is in the footer) under 700px, so
             * change the language automatically base on system lang while mobile.
             */
            let preferredLanguage;
            if (isMobileDevice()) {
                // If mobile, use system language
                preferredLanguage = navigator.language || 'en-UK';
            } else {
                // Else storage language first
                preferredLanguage = localStorage.getItem("preferredLanguage") || 'en-UK';
            }
            changeLanguage(preferredLanguage);
        }).catch(error => console.error("Error initializing the page:", error));
    });

    /**
     * Function to check if the current device is a mobile device.
     *
     * @return {boolean} - True if mobile.
     */
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent);
    }
}

/**
 * Functions about change the language based on the selected language.
 * */
{
    /**
     * Function to retrieve localised strings with fallback
     *
     * @param key - The key of the string, e.g. "zh-CN"
     * @return {*|string} - The localised string
     */
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
     * Global variable to store current language strings.
     *
     * @type {{}} - The current language strings
     */
    window.currentLanguageStrings = {};

    /**
     * Function to change the language
     *
     * @param language - The language key to change to
     */
    function changeLanguage(language) {
        // Save the selected language
        window.localStorage.setItem("preferredLanguage", language);

        // Load the new language
        fetch(`../languages/${language}.json`)
            .then(response => response.json())
            .then(data => {
                // Store the loaded language strings
                window.currentLanguageStrings = data.Strings;
                // Update the language attribute of the HTML element
                updateLangAttribute(language);
                // Update page content with the loaded language
                updatePageContent();
                // To update all placeholders
                updatePlaceholders();
            })
            .catch(error => console.error("Error loading the language file:", error));
    }

    /**
     * Function to update the language attribute of the HTML element (If not, some plug-in which
     * relate with language will still try to work e.g. Google translator).
     *
     * @param language - The language to set
     */
    function updateLangAttribute(language) {
        document.documentElement.lang = language;
    }

    /**
     * Function to update the page content with the loaded language
     */
    function updatePageContent() {
        // I set every content needed to be translated in "lang-test" class.
        document.querySelectorAll(".lang-text").forEach(element => {
            // "data-key" is the 属性 in lang.json
            const key = element.getAttribute("data-key");
            if (key in window.currentLanguageStrings) {
                element.textContent = window.currentLanguageStrings[key];
            } else {
                /*This could help us to update lang because sometime people will forget to add
                <span> for their content. */
                console.error(`Key "${key}" not found in the language file.`);
            }
        });
    }

    /**
     * Function to update all placeholders.
     * Actually, I only use this function for Search box, I think.
     */
    function updatePlaceholders() {
        document.querySelectorAll('input[data-key]').forEach(input => {
            const key = input.getAttribute('data-key');
            if (key && key in window.currentLanguageStrings) {
                input.placeholder = window.currentLanguageStrings[key];
            }
            // No "else" because only Search box needs this.
        });
    }

    /**
     * Function to handle the click event of the language list.
     * This should be in "main.js" but whatever.
     */
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
}

/**
 * Some rather retro stuff.
 */
window.addEventListener('DOMContentLoaded', () => {
    console.log(`
#########################################################################################
##                                                                                     ##
##       ######  ######## ######## ########  #######   ##    ##  ######  ########      ##
##      ##    ##    ##    ##    ## ##    ##  ##     ## ##    ## ##    ##    ##         ##
##      ##          ##    ##    ## ##    ##  ##     ## ##    ## ##          ##         ##
##       ######     ##    ######## ########  ##     ## ##    ##  ######     ##         ##
##            ##    ##    ##    ## ##   ##   ##     ## ##    ##       ##    ##         ##
##      ##    ##    ##    ##    ## ##    ##  ##     ## ##    ## ##    ##    ##         ##
##       ######     ##    ##    ## ##     ## #######    ######  ######      ##         ## 
##                                                                                     ##
#########################################################################################
        `);
});
