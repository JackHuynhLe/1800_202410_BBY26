function displayLocationsInTable(locationsArray) {
    const tableBody = document.getElementById('locationsTableBody');
    tableBody.innerHTML = ''; // Clear existing table rows

    locationsArray.forEach((location, index) => {
        const row = tableBody.insertRow();
        const indexCell = row.insertCell();
        indexCell.textContent = index + 1;
        const latitudeCell = row.insertCell();
        latitudeCell.textContent = location.latitude;
        const longitudeCell = row.insertCell();
        longitudeCell.textContent = location.longitude;
        const dateTimeCell = row.insertCell();
        dateTimeCell.textContent = location.dateTime;
        const actionsCell = row.insertCell(); // New cell for actions

        // Create a button to view the location on map
        const viewMapButton = document.createElement('button');
        viewMapButton.textContent = 'View on Map';
        viewMapButton.addEventListener('click', () => {
            displayLocationOnMap(location.latitude, location.longitude);
        });

        actionsCell.appendChild(viewMapButton); // Append the button to the actions cell
    });
}

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
