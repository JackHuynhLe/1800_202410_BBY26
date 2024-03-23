// firebaseInit.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBe2uRryeZt6ZyoV2wIntcPSFmK4NscB_M",
    authDomain: "stardust-c2172.firebaseapp.com",
    projectId: "stardust-c2172",
    storageBucket: "stardust-c2172.appspot.com",
    messagingSenderId: "279779949138",
    appId: "1:279779949138:web:63bdb7a17a70af5f21fd8b",
    measurementId: "G-2QKFW42EBM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
