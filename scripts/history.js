/**
 * Interactive of the history page.
 * */
document.addEventListener("DOMContentLoaded", () => {
    const travelHistoryContainer = document.getElementById("travelHistoryContainer");
    document.getElementById("travelHistoryBtn").addEventListener("click", () => {
        travelHistoryContainer.style.display = travelHistoryContainer.style.display === "flex" ? "none" : "flex";
    });

});