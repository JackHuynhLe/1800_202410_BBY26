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
function changeLanguage(language) {
    fetch(`/languages/${language}`)
        .then(response => response.json())
        .then(data => {
            let strings = data.Strings;
            for (let key in strings) {
                let element = document.getElementById(key);
                if (element) {
                    element.textContent = strings[key];
                }
            }
        })
        .catch(error => console.error("Error loading the language file:", error));
}

document.body.addEventListener("click", function (event) {
    // 通过event.target检查点击的是否是我们关心的元素
    if (event.target.matches(".interlanguage-link, .interlanguage-link *")) {
        const element = event.target.closest(".interlanguage-link");
        const selectedLanguageCode = element.getAttribute("data-code");
        changeLanguage(selectedLanguageCode);
    }
});
