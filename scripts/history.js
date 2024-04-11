/**
 * Interactive of the history page.
 * */
document.addEventListener("DOMContentLoaded", () => {

    showOrHide(".viewOnMapBtn", ".historyContext", "click");
});

function showOrHide(element, selector, functionName) {
    document.querySelectorAll(selector + element).forEach(cb =>
        cb.addEventListener(functionName, () => {
            cb.classList.toggle("initiallyHidden");
        }))
}