// firebaseInit.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-authentication.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAPr5p921A7Nvox_17pcrADPIcXgONlaGo",
    authDomain: "bby26-c858c.firebaseapp.com",
    databaseURL: "https://bby26-c858c-default-rtdb.firebaseio.com",
    projectId: "bby26-c858c",
    storageBucket: "bby26-c858c.appspot.com",
    messagingSenderId: "569835543614",
    appId: "1:569835543614:web:fc118410cebf4f1169856f",
    measurementId: "G-3QTZ7MGJ7W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export to firebase.mjs
export const auth = getAuth(app);
export const db = getFirestore(app);
