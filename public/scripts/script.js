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
    const currentLanguage = language;
    fetch(`/languages/${language}`)
        .then(response => response.json())
        .then(data => {
            // 假设服务器返回的数据结构为 { Strings: { "text-welcomeToStardust": "欢迎", ... } }
            let strings = data.Strings;
            document.querySelectorAll('[id^="text-"]').forEach(element => {
                let key = element.id;
                if (strings[key]) {
                    element.textContent = strings[key];
                } else {
                    console.error(`Key not found: ${key}`);
                }
            });
        })
        .catch(error => console.error("Error loading the language file:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    const languageListItems = document.querySelectorAll(".interlanguage-link");
    languageListItems.forEach(item => {
        item.addEventListener("click", (event) => {
            const selectedLanguageCode = event.currentTarget.getAttribute("data-code");
            changeLanguage(selectedLanguageCode);
        });
    });
});
