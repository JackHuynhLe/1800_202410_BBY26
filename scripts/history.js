document.addEventListener("DOMContentLoaded", () => {
    toggleEvent("#travelHistoryBtn", "#travelHistoryContainer");

    toggleEvent("#backToHistoryBtn", "#historyMapContainer")
    toggleEvent("#backToHistoryBtn", "#historySelectContainer");
});

/**
 * Init toggle event function
 * @param {string} activatorSelector
 * @param {string} targetSelector
 */
function toggleEvent(activatorSelector, targetSelector) {

    const activator = document.querySelectorAll(activatorSelector);
    const targets = document.querySelectorAll(targetSelector);


    if (activator.length && targets.length) {
        activator.forEach(activator => activator.addEventListener("click",
            () => {
                //Change the class of the target elements
                targets.forEach(target => target.classList.toggle
                ("initiallyHidden"));
            })
        );
    }
}
