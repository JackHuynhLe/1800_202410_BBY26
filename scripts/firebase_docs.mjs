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

// This function will not run please take a look at it
// The button when pressed will not call this function. The console.logs do not work either
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
            locationsArray.push(doc.data());
        });

        // Update UI
        const locationsDisplay = document.getElementById('locationsDisplay');
        locationsDisplay.innerHTML = '';
        locationsArray.forEach(location => {
            const locationElement = document.createElement('p');
            locationElement.textContent = `Latitude: ${location.latitude}, Longitude: ${location.longitude}, DateTime: ${location.dateTime}`;
            locationsDisplay.appendChild(locationElement);
        });
    } else {
        console.log("No user is signed in.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetchLocationsBtn').addEventListener('click', fetchUserLocations);
});

console.log("Script is running");
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    document.getElementById('fetchLocationsBtn').addEventListener('click', fetchUserLocations);
    console.log("Event listener attached");
});

