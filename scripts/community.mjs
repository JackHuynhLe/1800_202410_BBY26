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

// Usage: Saving a new post
async function saveNewPost(postTitle, postText) {
    await savePostToUserFirestore(postTitle, postText);
}

document.addEventListener('DOMContentLoaded', () => {
    // Get a reference to the form
    const postForm = document.getElementById('postForm');

    // Add event listener to the form submission
    postForm.addEventListener('submit', async (event) => {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the values from the form inputs
        const postTitle = document.getElementById('postTitle').value;
        const postText = document.getElementById('postText').value;

        // Call the function to save the new post
        await saveNewPost(postTitle, postText);

        // Clear the textboxes after saving the post
        document.getElementById('postTitle').value = "";
        document.getElementById('postText').value = "";

        getAllPosts();

    });
});


async function getAllPosts() {
    console.log("Fetching all posts...");
    try {
        // Initialize an empty array to store all posts
        const allPosts = [];

        // Query all user documents
        const querySnapshot = await getDocs(collection(db, "users"));

        // Loop through each user document
        querySnapshot.forEach(async (userDoc) => {
            // Get the reference to the "posts" subcollection under the user document
            const postsCollection = collection(db, "users", userDoc.id, "posts");

            // Query all documents in the "posts" subcollection
            const postsSnapshot = await getDocs(postsCollection);

            // Loop through each post document
            postsSnapshot.forEach((postDoc) => {
                // Get the data of the post document and add it to the allPosts array
                allPosts.push(postDoc.data());
            });

            // Once all posts have been retrieved, update the HTML to display them
            const postsContainer = document.getElementById('postsList');
            postsContainer.innerHTML = ''; // Clear existing content

            allPosts.forEach((postData) => {
                // Create HTML elements for the post
                const postElement = document.createElement('li');
                const postTitleElement = document.createElement('h3');
                const postTextElement = document.createElement('p');

                // Set the content of the HTML elements
                postTitleElement.textContent = postData.postTitle;
                postTextElement.textContent = postData.postText;

                // Append post title and text to the post element
                postElement.appendChild(postTitleElement);
                postElement.appendChild(postTextElement);

                // Append the post element to the container
                postsContainer.appendChild(postElement);
            });
        });
    } catch (error) {
        console.error("Error retrieving posts:", error);
    }
}

// Call the function to retrieve and display all posts
getAllPosts();
