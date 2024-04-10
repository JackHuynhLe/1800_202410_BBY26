import {auth, db} from './firebaseInit.js';
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

// Function to reverse geocode the latitude and longitude
async function reverseGeocode(latitude, longitude) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
        const data = await response.json();
        return {
            country: data.address.country,
            city: data.address.city || data.address.town || data.address.village,
            state: data.address.state
        };
    } catch (error) {
        console.error("Error reverse geocoding location:", error);
        return null;
    }
}

async function saveLocationToFirestore(latitude, longitude, dateTime, locationName) {
    try {
        // Access the currently authenticated user
        const user = auth.currentUser;

        // Ensure user is logged in
        if (!user) {
            alert(getLocalisedString("userNotLoggedIn"));
            return;
        }

        // Reverse geocode the location
        const locationDetails = await reverseGeocode(latitude, longitude);
        if (!locationDetails) {
            console.error("Failed to retrieve location details.");
            return;
        }

        // Construct the data object to be saved to Firestore
        const locationData = {
            latitude: latitude,
            longitude: longitude,
            dateTime: dateTime,
            locationName: locationName,
            country: locationDetails.country,
            city: locationDetails.city,
            province: locationDetails.state
        };

        // Get the user document ID from the users collection
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (!userDocSnapshot.exists()) {
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

            // Prompt the user to enter a location name
            const locationName = prompt("Enter a location name:");

            // Access the Firestore database
            const firestore = getFirestore();

            // Access the currently authenticated user
            const user = auth.currentUser;

            // Ensure user is logged in
            if (!user) {
                alert(getLocalisedString("userNotLoggedIn"));
                return;
            }

            // Save the location to Firestore
            saveLocationToFirestore(latitude, longitude, dateTime, locationName);
        }, handleError);
    } else {
        alert(getLocalisedString("geoNotSupported"));
    }
}

// Add event listener to the button to save the current location
document.getElementById('saveLocationBtn').addEventListener('click', saveCurrentLocation);

console.log("Script is running");