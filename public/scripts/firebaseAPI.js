//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyAPr5p921A7Nvox_17pcrADPIcXgONlaGo",
    authDomain: "bby26-c858c.firebaseapp.com",
    projectId: "bby26-c858c",
    storageBucket: "bby26-c858c.appspot.com",
    messagingSenderId: "569835543614",
    appId: "1:569835543614:web:fc118410cebf4f1169856f"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
