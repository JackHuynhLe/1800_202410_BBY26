/**
 * Interactive of the history page.
 * */
document.addEventListener("DOMContentLoaded", () => {

    showOrHide("#travelHistoryBtn", "#travelHistoryContainer", "click");
});

function showOrHide(ActivateElementSelector, ModifyElementSelector, functionName) {
    document.querySelectorAll(ActivateElementSelector).forEach(cb =>
        cb.addEventListener(functionName, () => {
            document.querySelectorAll(ModifyElementSelector).forEach(
                el => el.classList.toggle("initiallyHidden")
            )
        }));
}