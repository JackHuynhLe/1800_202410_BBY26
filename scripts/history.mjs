import {auth, db} from './firebaseInit.js'
import {saveCurrentLocation} from './firebase_docs.mjs'
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


