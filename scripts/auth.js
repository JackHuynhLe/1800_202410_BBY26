// auth.js
import {signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {auth} from "./firebaseInit.js";
import {db} from "./firebaseInit.js";
import {collection, getDocs} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import {setupGuides} from "./login.js";
import {setupUI} from "./login.js";

//listen for auth status changes
document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            document.getElementById("loginContainer").style.display = "none";
            document.getElementById("profileContainer").style.display = "block";
            const docRef = collection(db, "users");
            getDocs(docRef).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    if (doc.data().email === user.email) {
                        setupGuides(snapshot.docs);
                        setupUI(user);
                    }
                });
            });

        } else {
            document.getElementById("loginContainer").style.display = "block";
            document.getElementById("profileContainer").style.display = "none";
        }
    });
});