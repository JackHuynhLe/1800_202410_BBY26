import {auth} from './firebaseInit.js';
import {
    doc,
    setDoc,
    collection,
    addDoc,
    getFirestore
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
