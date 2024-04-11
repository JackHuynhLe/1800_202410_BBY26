import {auth, db} from './firebaseInit.js';
import {
    doc,
    collection,
    addDoc,
    getDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

/**
 * Function to get the current user
 * @return {Promise<*>} Promise that resolves to the current user
 */
async function getCurrentUser() {
    const user = auth.currentUser;
    if (!user) {
        alert("User not logged in");
        throw new Error("User not logged in");
    }
    return user;
}

/**
 * Function to get the user data
 * @param uid {string} The user ID
 * @return {Promise<*>} Promise that resolves to the user data
 */
async function getUserData(uid) {
    const userDocRef = doc(db, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
        throw new Error("User document does not exist");
    }
    return userDocSnapshot.data();
}

/**
 * Function to save a post to Firestore
 * @param postTitle {string} The title of the post
 * @param postText {string} The text of the post
 * @return {Promise<void>} Promise that resolves when the post is saved
 */
async function savePostToUserFirestore(postTitle, postText) {
    try {
        const user = await getCurrentUser();
        const userData = await getUserData(user.uid);

        const postData = {
            postTitle,
            postText,
            postDate: new Date().toISOString(),
            postViews: 0,
            userName: userData.name
        };

        await addDoc(collection(db, "users", user.uid, "posts"), postData);
        alert("Post saved successfully");
    } catch (error) {
        console.error("Error saving post to Firestore:", error);
        alert("Failed to save post");
    }
}

/**
 * Function to get all posts from Firestore
 * @return {Promise<void>} Promise that resolves when the posts are retrieved
 */
async function getAllPosts() {
    try {
        const postsContainer = document.getElementById('postsList');
        postsContainer.innerHTML = '';

        const querySnapshot = await getDocs(collection(db, "users"));
        await Promise.all(querySnapshot.docs.map(async userDoc => {
            const postsSnapshot = await getDocs(collection(db, "users", userDoc.id, "posts"));
            postsSnapshot.forEach(postDoc => {
                const postData = postDoc.data();
                postsContainer.appendChild(createPostElement(postData));
            });
        }));
    } catch (error) {
        console.error("Error retrieving posts:", error);
    }
}

/**
 * Function to create a new post element
 * @param postData {object} The post data
 * @return {HTMLLIElement} The created post element
 */
function createPostElement(postData) {
    const postElement = document.createElement('li');
    postElement.innerHTML = `
        <h3>${postData.postTitle}</h3>
        <p>${postData.postText}</p>
        <p>Date: ${formatDate(postData.postDate)}</p>
        <p>Posted by: ${postData.userName}</p>
    `;
    return postElement;
}

/**
 * Function to format a date to a readable string
 * @param dateString {string} The date string
 * @return {string} The formatted date string
 */
function formatDate(dateString) {
    const postDate = new Date(dateString);
    return postDate.toLocaleString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
    });
}

/**
 * Function to initialise event listeners
 */
function initEventListeners() {
    document.getElementById('togglePostFormBtn').addEventListener('click', togglePostForm);
    document.getElementById('postForm').addEventListener('submit', handlePostFormSubmit);
    document.getElementById('cancelPostBtn').addEventListener('click', clearAndHidePostForm);
}

/**
 * Function to toggle the post-form
 */
function togglePostForm() {
    const postForm = document.getElementById('postForm');
    const userPostsMove = document.getElementById('userPostsMove');

    postForm.classList.toggle('initiallyHidden');
    userPostsMove.classList.toggle('initiallyHidden');

}

/**
 * Function to handle the submission of the post form
 * @param event {Event} The form submission event
 * @return {Promise<void>} Promise that resolves when the post is saved
 */
async function handlePostFormSubmit(event) {
    event.preventDefault();
    const postTitle = document.getElementById('postTitle').value;
    const postText = document.getElementById('postText').value;

    if (!postTitle || !postText) {
        const which = postText ? "title" :
            postTitle ? "text" : "title and a text";
        alert("please enter a " + which + "!");
        return;
    }

    await savePostToUserFirestore(postTitle, postText);
    await getAllPosts();
    clearAndHidePostForm();
}

/**
 * Function to clear and hide the post-form
 */
function clearAndHidePostForm() {
    document.getElementById('postTitle').value = null;
    document.getElementById('postText').value = null;
    document.getElementById('postForm').classList.toggle('initiallyHidden');
    document.getElementById('userPostsMove').classList.toggle('initiallyHidden');
}

/**
 * Function to initialise the app
 */
function init() {
    getAllPosts()
        .catch(error => console.error("Error retrieving posts:", error));
    initEventListeners();
}

init();
