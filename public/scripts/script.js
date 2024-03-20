//---------------------------------
// Your own functions here
//---------------------------------


function sayHello() {
  //do something
}
//sayHello();    //invoke function

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("logging out user");
  }).catch((error) => {
    // An error happened.
  });
}

// Function to store geolocation in Firebase
function storeGeolocation(latitude, longitude) {
  const userLocationsRef = database.ref('user_locations');
  const newLocationRef = userLocationsRef.push();
  
  newLocationRef.set({
    latitude: latitude,
    longitude: longitude
  }).then(() => {
    console.log("Geolocation data stored successfully.");
  }).catch((error) => {
    console.error("Error storing geolocation data:", error);
  });
}

// Automatically record geolocation when page loads
window.addEventListener('load', () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        storeGeolocation(latitude, longitude);
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
});