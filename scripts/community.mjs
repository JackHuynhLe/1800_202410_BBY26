import { auth, db } from './firebaseInit.js';
import {
    doc,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Function to save a post to a user's collection in Firestore
async function savePostToUserFirestore(postTitle, postText) {
    try {
        // Access the currently authenticated user
        const user = auth.currentUser;

        // Ensure user is logged in
        if (!user) {
            alert("User not logged in");
            return;
        }

        // Construct the data object to be saved to Firestore
        const postData = {
            postTitle: postTitle,
            postText: postText,
            postDate: new Date().toISOString(),
            postViews: 0 // You can set initial views to 0
        };

        // Add the post data to Firestore under the user's document
        await addDoc(collection(db, "users", user.uid, "posts"), postData);

        // Success message
        alert("Post saved successfully");
    } catch (error) {
        console.error("Error saving post to Firestore:", error);
        alert("Failed to save post");
    }
}

// Function to retrieve posts from Firestore for the current user
async function getUserPostsFromFirestore() {
    try {
        // Access the currently authenticated user
        const user = auth.currentUser;

        // Ensure user is logged in
        if (!user) {
            alert("User not logged in");
            return [];
        }

        // Retrieve all posts for the current user from Firestore
        const querySnapshot = await getDocs(collection(db, "users", user.uid, "posts"));
        const userPosts = [];
        querySnapshot.forEach((doc) => {
            userPosts.push({ id: doc.id, ...doc.data() });
        });
        return userPosts;
    } catch (error) {
        console.error("Error fetching user posts from Firestore:", error);
        alert("Failed to fetch user posts");
        return [];
    }
}

// Usage: Saving a new post
async function saveNewPost(postTitle, postText) {
    await savePostToUserFirestore(postTitle, postText);
}

// Usage: Retrieving posts for the current user
async function displayUserPosts() {
    const userPosts = await getUserPostsFromFirestore();
    console.log("User posts:", userPosts);
    // Now you can display the user's posts in your HTML or perform further actions
}

// Add event listener to the button to save the new post
document.getElementById('savePostBtn').addEventListener('click', async () => {
    const postTitle = document.getElementById('postTitle').value;
    const postText = document.getElementById('postText').value;
    await saveNewPost(postTitle, postText);
});

// Call the function to display user posts when needed
displayUserPosts();
