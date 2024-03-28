// Import auth and db from firebaseInit.js
import { auth, db } from './firebaseInit.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Listen for auth state changes to ensure we have a user logged in
auth.onAuthStateChanged(user => {
    if (user) {
        // If there's a user, setup form submission listener
        const form = document.querySelector('#infoForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Collect form data
            const userInfo = {
                name: form.name.value,
                address: form.address.value,
                gender: form.gender.value,
                bio: form.bio.value,
                phone: form.phone.value,
            };

            try {
                // Use the user's UID as the document ID in the 'users' collection
                await setDoc(doc(db, "users", user.uid), userInfo);
                alert("Profile information successfully saved!");
                window.location.href = '../index.html';
                form.reset();
            } catch (error) {
                console.error("Error saving profile information:", error);
                alert("Failed to save profile information.");
            }
        });
    } else {
        // If no user is signed in, possibly redirect to the login page or show an alert
        console.log("No user is signed in.");
        alert("Please sign in to update your profile.");
        // Redirect to login page if necessary
        // window.location.href = '/login.html';
    }
});
