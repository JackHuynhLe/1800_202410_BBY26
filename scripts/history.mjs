import {saveCurrentLocation} from './firebase_docs.mjs'
import {auth, db} from './firebaseInit.js'
import {
    doc,
    setDoc,
    collection,
    addDoc,
    getFirestore,
    query,
    where,
    getDocs,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // Attach event listener to saveLocationBtn
    const saveLocationBtn = document.getElementById('saveLocationBtn');
    if (saveLocationBtn) {
        console.log("saveLocationBtn found, attaching event listener");
        saveLocationBtn.addEventListener('click', saveCurrentLocation);
    } else {
        console.error("saveLocationBtn not found in the DOM");
    }

    // Attach event listener to fetchLocationsBtn
    const fetchLocationsBtn = document.getElementById('fetchLocationsBtn');
    if (fetchLocationsBtn) {
        console.log("fetchLocationsBtn found, attaching event listener");
        fetchLocationsBtn.addEventListener('click', fetchUserLocations);
    } else {
        console.error("fetchLocationsBtn not found in the DOM");
    }

    console.log("Event listeners attached");
});


// Function to display the location on the map section
async function displayLocationOnMap(latitude, longitude, dateTime) {
    const mapSection = document.getElementById('mapSection');
    if (mapSection) {
        try {
            // Reverse geocode to get city, state, and country
            const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
            const response = await fetch(reverseGeocodeUrl);
            const data = await response.json();
            const address = data.address;
            const city = address.city || address.town || address.village || address.hamlet || address.suburb || '';
            const province = address.state || address.county || '';
            const country = address.country || '';

            // Construct the HTML content for displaying the map with a marker and information
            const mapHtml = `
            <div class="map-container">
                <iframe id="mapFrame" width="600" height="450" frameborder="0" style="border:0;"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.005},${latitude - 0.005},${longitude + 0.005},${latitude + 0.005}&layer=mapnik&marker=${latitude},${longitude}">
                </iframe>
                <div class="map-info-box">
                    <p>Date: ${dateTime}</p>
                    <p>City: ${city}</p>
                    <p>Province: ${province}</p>
                    <p>Country: ${country}</p>
                </div>
            </div>`;


            // Set the HTML content of the mapSection
            mapSection.innerHTML = mapHtml;


            // Add a marker to the map
            L.marker([latitude, longitude]).addTo(mymap)
                .bindPopup(`<b>${city}</b><br>${province}, ${country}`)
                .openPopup();


        } catch (error) {
            console.error("Error fetching reverse geocode data:", error);
        }
    } else {
        console.error("mapSection element not found in the DOM");
    }
}


// Function to display locations in a table
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

        // Attach event listener to the button
        viewMapButton.addEventListener('click', () => {
            // When the button is clicked, display the location on the map
            displayLocationOnMap(location.latitude, location.longitude, location.dateTime);
        });

        // Append the button to the actions cell
        actionsCell.appendChild(viewMapButton);
    });
}

// Hide table headers initially
document.getElementById('locationsTable').style.display = 'none';

// Function to show table headers
function showTableHeaders() {
    document.getElementById('locationsTable').style.display = 'table';
}

// Add event listener to the button to fetch locations
document.getElementById('fetchLocationsBtn').addEventListener('click', async () => {
    // Fetch user locations when the button is clicked
    await fetchUserLocations();
    // Show table headers after fetching locations
    showTableHeaders();
});

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch user locations when the page loads
    await fetchUserLocations();
});

async function fetchUserLocations() {
    const locationsArray = [];
    const user = auth.currentUser;

    if (user) {
        console.log(`Found user: ${user.uid}`); // Log to confirm user is found
        const locationsRef = collection(db, "users", user.uid, "locations");
        console.log("Accessing user locations collection..."); // Log accessing the collection
        const q = query(locationsRef);
        const querySnapshot = await getDocs(q); // Corrected function name to getDocs

        if (!querySnapshot.empty) {
            console.log("Found location documents."); // Log if documents are found
        } else {
            console.log("No location documents found."); // Log if no documents are found
        }

        querySnapshot.forEach((doc) => {
            locationsArray.push({id: doc.id, ...doc.data()});
        });

        // Update UI by displaying locations in a table
        displayLocationsInTable(locationsArray);
    } else {
        console.log("No user is signed in.");
    }
}
