import { auth } from '../Project/scripts/firebaseInit.js';
import { doc, setDoc, collection, addDoc, getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
        alert(getLocalisedString("geoNotSupported"));
    }
}

/*
* Handles errors during geolocation fetching
* */
function handleError(error) {
    console.error('Geolocation error:', error);
    alert(getLocalisedString("geoNotSupported"));
}

/*
* Generates URL for the iframe to display the map centered around the specified coordinates
* */
function generateMapURL(latitude, longitude, latOffset = 0.005, longOffset = 0.005) {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - longOffset},${latitude - latOffset},${longitude + longOffset},${latitude + latOffset}&layer=mapnik&marker=${latitude},${longitude}`;
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const zoomLevel = 13;
    const mapFrame = document.getElementById('mapFrame');
    mapFrame.src = generateMapURL(latitude, longitude, 0.01, 0.01);
}

/**
 * Function to search the given query on the map and update the iframe with the result.
 */
function searchOnMap() {
    const query = document.getElementById('site-search').value;
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
          if (data.length > 0) {
              let lat = parseFloat(data[0].lat);
              let lon = parseFloat(data[0].lon);
              // update the iframe
              document.getElementById('mapFrame').src = generateMapURL(lat, lon);
          } else {
              alert(getLocalisedString("noResultsFound"));
          }
      })
      .catch(error => {
          console.error('Search error:', error);
          alert(getLocalisedString("searchError"));
      });
}

// Function to save the current location to Firebase Firestore
async function saveLocationToFirestore(latitude, longitude, dateTime) {
    try {
        // Access the currently authenticated user
        const user = auth.currentUser;

        // Ensure user is logged in
        if (!user) {
            alert("User not authenticated. Please log in.");
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
        alert("Location saved successfully to Firestore!");
    } catch (error) {
        console.error("Error saving location to Firestore:", error);
        alert("Failed to save location to Firestore.");
    }
}

// Function to save the current location
function saveCurrentLocation() {
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
                alert("User not authenticated. Please log in.");
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
                .then(function(docRef) {
                    // Success message
                    alert("Location saved successfully to Firestore!");
                })
                .catch(function(error) {
                    console.error("Error saving location to Firestore:", error);
                    alert("Failed to save location to Firestore.");
                });

            // Example: Alert the user that the location is saved
            alert(getLocalisedString("locationSavedSuccess"));
        }, handleError);
    } else {
        alert(getLocalisedString("geoNotSupported"));
    }
}



window.onload = initMap;

// Add event listener to the button to save the current location
document.getElementById('saveLocationBtn').addEventListener('click', saveCurrentLocation);
