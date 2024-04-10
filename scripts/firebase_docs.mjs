import { auth , db} from './firebaseInit.js';
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




// Function to save the current location to Firebase Firestore
async function saveLocationToFirestore(latitude, longitude, dateTime) {
    try {
        // Access the currently authenticated user
        const user = auth.currentUser;

        // Ensure user is logged in
        if (!user) {
            alert(getLocalisedString("userNotLoggedIn"));
            return;
        }

        // Construct the data object to be saved to Firestore
        const locationData = {
            latitude: latitude,
            longitude: longitude,
            dateTime: dateTime
        };

        // Get the user document ID from the users collection
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await userDocRef.get();
        if (!userDocSnap.exists()) {
            console.error("User document not found.");
            return;
        }

        // Add a new collection under the user's document ID
        const locationsCollectionRef = collection(userDocRef, "locations");
        await addDoc(locationsCollectionRef, locationData);

        // Success message
        alert(getLocalisedString("locationSavedSuccess"));
        console.log("hello");
    } catch (error) {
        console.error("Error saving location to Firestore:", error);
        alert(getLocalisedString("locationSaveError"));
    }
}


// Function to save the current location
export function saveCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const dateTime = new Date().toLocaleString(); // Get current date and time

            // Access the Firestore database
            const firestore = getFirestore();

            // Access the currently authenticated user
            const user = auth.currentUser;

            // Ensure user is logged in
            if (!user) {
                alert(getLocalisedString("userNotLoggedIn"));
                return;
            }

            // Construct the data object to be saved to Firestore
            const locationData = {
                latitude: latitude,
                longitude: longitude,
                dateTime: dateTime
            };

            // Add the location data to Firestore under the user's document
            addDoc(collection(firestore, "users", user.uid, "locations"), locationData)
                .then(function (docRef) {
                    // Success message
                    alert(getLocalisedString("locationSavedSuccess"));
                })
                .catch(function (error) {
                    console.error("Error saving location to Firestore:", error);
                    alert(getLocalisedString("locationSaveError"));
                });
        }, handleError);
    } else {
        alert(getLocalisedString("geoNotSupported"));
    }
}


// Add event listener to the button to save the current location
document.getElementById('saveLocationBtn').addEventListener('click', saveCurrentLocation);


<<<<<<< HEAD
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
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.02},${latitude-0.01},${longitude+0.02},${latitude+0.01}">
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
=======

>>>>>>> 06bd66ddd957029553110695edc611183ab5a92d




console.log("Script is running");