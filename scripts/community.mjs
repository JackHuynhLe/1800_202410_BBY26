import { auth, db } from './firebaseInit.js';
import {
    doc,
    collection,
    addDoc,
    getDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

async function savePostToUserFirestore(postTitle, postText) {
    try {
        const user = auth.currentUser;
        if (!user) {
            alert("User not logged in");
            return;
        }

        // Fetch the user's document to get their name
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            console.log("User data:", userData); // Log user data to check if name is present
            const userName = userData.name; // Assuming the field name is "name"

            // Include the user's name in the post data
            const postData = {
                postTitle: postTitle,
                postText: postText,
                postDate: new Date().toISOString(),
                postViews: 0,
                userName: userName // Include user's name in post data
            };

            await addDoc(collection(db, "users", user.uid, "posts"), postData);
            alert("Post saved successfully");
        } else {
            console.error("User document does not exist");
            alert("Failed to save post");
        }
    } catch (error) {
        console.error("Error saving post to Firestore:", error);
        alert("Failed to save post");
    }
}





// Usage: Saving a new post
async function saveNewPost(postTitle, postText) {
    await savePostToUserFirestore(postTitle, postText);
}


async function getAllPosts() {
    try {
        const postsContainer = document.getElementById('postsList');
        postsContainer.innerHTML = ''; // Clear existing content

        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach(async (userDoc) => {
            const postsCollection = collection(db, "users", userDoc.id, "posts");
            const postsSnapshot = await getDocs(postsCollection);

            postsSnapshot.forEach((postDoc) => {
                const postData = postDoc.data();
                const postElement = document.createElement('li');
                const postTitleElement = document.createElement('h3');
                const postTextElement = document.createElement('p');
                const postDateElement = document.createElement('p');
                const userNameElement = document.createElement('p');

                postTitleElement.textContent = postData.postTitle;
                postTextElement.textContent = postData.postText;

                // Convert ISO date string to Date object
                const postDate = new Date(postData.postDate);

                // Format the date and time as desired
                const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
                const formattedDateTime = postDate.toLocaleString('en-US', options);

                postDateElement.textContent = "Date: " + formattedDateTime;
                userNameElement.textContent = "Posted by: " + postData.userName;

                postElement.appendChild(postTitleElement);
                postElement.appendChild(postTextElement);
                postElement.appendChild(postDateElement); // Add date to post
                postElement.appendChild(userNameElement); // Add user name to post

                postsContainer.appendChild(postElement);
            });
        });
    } catch (error) {
        console.error("Error retrieving posts:", error);
    }
}


// Call the function to retrieve and display all posts
getAllPosts();



// Add event listener to the button for toggling the post form
document.getElementById('togglePostFormBtn').addEventListener('click', () => {
    const postForm = document.getElementById('postForm');
    if (postForm.style.display === 'none') {
        postForm.style.display = 'block'; // Show the post form
    } else {
        postForm.style.display = 'none'; // Hide the post form
    }
});

// Add event listener to the form submission
document.getElementById('postForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const postTitle = document.getElementById('postTitle').value;
    const postText = document.getElementById('postText').value;

    await saveNewPost(postTitle, postText); // Save the post
    getAllPosts();


    // Clear the form fields
    document.getElementById('postTitle').value = '';
    document.getElementById('postText').value = '';

    // Hide the post form after submission
    document.getElementById('postForm').style.display = 'none';
});

// Add event listener to the "Cancel" button to close the form without submitting
document.getElementById('cancelPostBtn').addEventListener('click', () => {
    // Clear the form fields
    document.getElementById('postTitle').value = '';
    document.getElementById('postText').value = '';

    // Hide the post form
    document.getElementById('postForm').style.display = 'none';
});


