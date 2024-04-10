

let map; // Declare map variable outside the function scope

function displayLocationOnMap(latitude, longitude) {
    if (!map) {
        // Initialize the map if it's not already initialized
        map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        // Clear previous markers if any
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        // Set new view
        map.setView([latitude, longitude], 13);
    }
    
    // Add marker for the location
    L.marker([latitude, longitude]).addTo(map);
}
