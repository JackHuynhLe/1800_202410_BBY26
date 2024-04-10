import { db } from './firebaseInit.js';
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Function to retrieve posts from Firestore
async function getUserPostsFromFirestore() {
    try {
        // Retrieve all posts from the "users" collection
        const postsRef = collection(db, "users");
        const querySnapshot = await getDocs(postsRef);
        const userPosts = [];
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            userData.posts.forEach((post) => {
                userPosts.push({
                    userName: userData.name,
                    postTitle: post.postTitle,
                    postText: post.postText,
                    postDate: post.postDate
                });
            });
        });
        return userPosts;
    } catch (error) {
        console.error("Error fetching user posts from Firestore:", error);
        throw error;
    }
}

// Usage: Retrieving posts and displaying them in the HTML
async function displayUserPosts() {
    try {
        const userPosts = await getUserPostsFromFirestore();
        const postsList = document.getElementById('postsList');
        postsList.innerHTML = ''; // Clear existing posts

        userPosts.forEach((post) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <h3>${post.postTitle}</h3>
                <p>${post.postText}</p>
                <p>Posted by ${post.userName} on ${post.postDate}</p>
            `;
            postsList.appendChild(li);
        });
    } catch (error) {
        console.error("Error displaying user posts:", error);
        alert(`Failed to display user posts: ${error.message}`);
    }
}

// Call the function to display user posts when needed
displayUserPosts();