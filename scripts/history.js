/**
 * Interactive of the history page.
 * */
document.addEventListener("DOMContentLoaded", () => {

<<<<<<< HEAD
    showOrHide(".viewOnMapBtn", ".historyContext", "click");
});

function showOrHide(element, selector, functionName) {
    document.querySelectorAll(selector + element).forEach(cb =>
        cb.addEventListener(functionName, () => {
            cb.classList.toggle("initiallyHidden");
        }))
=======
    showOrHide("#travelHistoryBtn", "#travelHistoryContainer", "click");
});

function showOrHide(ActivateElementSelector, ModifyElementSelector, functionName) {
    document.querySelectorAll(ActivateElementSelector).forEach(cb =>
        cb.addEventListener(functionName, () => {
            document.querySelectorAll(ModifyElementSelector).forEach(
                el => el.classList.toggle("initiallyHidden")
            )
        }));
>>>>>>> 72e3376a2a2158c8dc3f059dc4d77300329c28c1
}