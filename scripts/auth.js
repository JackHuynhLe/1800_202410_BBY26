// auth.js
import {
    signInWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import {
    createUserWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import {auth} from './firebaseInit.js';
import {db} from './firebaseInit.js';
import {collection, getDocs} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import {setupGuides} from './login.js';
import {setupUI} from './login.js';

/**
 * To check the user's authentication state and change the UI accordingly
 *
 * @param {import('firebase/auth').User} user The current user
 */
auth.onAuthStateChanged(user => {
    if (user) {
        getDocs(collection(db, 'Guides')).then(snapshot => {
            snapshot.docs.forEach(doc => {
                setupGuides(snapshot.docs);
                setupUI(user);
            });
        });

    } else {
        setupGuides([]);
        setupUI();
    }
});

/**
 * Handle the submission of the signup form to create a new user.
 *
 * @type {Element} e - The event object.
 */
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log("user created");
            const modal = document.querySelector('#modal-signup');
            M.Modal.getInstance(modal).close();
            signupForm.reset();
        });
});

/**
 * Function to handle the logout button.
 *
 * @type {Element} e - The event object.
 */
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

/**
 * Function to handle the login form.
 *
 * @type {Element}
 */
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    signInWithEmailAndPassword(auth, email, password).then(cred => {
        //close the login modal
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
})


