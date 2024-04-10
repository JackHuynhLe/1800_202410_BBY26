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