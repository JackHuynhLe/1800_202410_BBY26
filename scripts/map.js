function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
        alert(getLocalisedString("geoNotSupported"));
    }
}

/*
* Handles errors during geolocation fetching
* */
function handleError(error) {
    console.error('Geolocation error:', error);
    alert(getLocalisedString("geoNotSupported"));
}

/*
* Generates URL for the iframe to display the map centered around the specified coordinates
* */
function generateMapURL(latitude, longitude, latOffset = 0.005, longOffset = 0.005) {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - longOffset},${latitude - latOffset},${longitude + longOffset},${latitude + latOffset}&layer=mapnik&marker=${latitude},${longitude}`;
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const zoomLevel = 13;
    const mapFrame = document.getElementById('mapFrame');
<<<<<<< HEAD
    mapFrame.src =
      `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},
      ${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
=======
    mapFrame.src = generateMapURL(latitude, longitude, 0.01, 0.01);
>>>>>>> 3861ef183058280721a4f5fcc77a8e65fd476477
}

/**
 * Function to search the given query on the map and update the iframe with the result.
 */
function searchOnMap() {
    const query = document.getElementById('site-search').value;
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
          if (data.length > 0) {
              let lat = parseFloat(data[0].lat);
              let lon = parseFloat(data[0].lon);
              // update the iframe
              document.getElementById('mapFrame').src = generateMapURL(lat, lon);
          } else {
              alert(getLocalisedString("noResultsFound"));
          }
      })
      .catch(error => {
          console.error('Search error:', error);
          alert(getLocalisedString("searchError"));
      });
}

// Function to save the current location
function saveCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const dateTime = new Date().toLocaleString(); // Get current date and time

            // Store latitude, longitude, and dateTime in a variable or perform any other action
            const savedLocation = {
                latitude: latitude,
                longitude: longitude,
                dateTime: dateTime
            };

            // Example: Storing the saved location in local storage
            localStorage.setItem('savedLocation', JSON.stringify(savedLocation));

            // Example: Alert the user that the location is saved
            alert(getLocalisedString("locationSavedSuccess"));
        }, handleError);
    } else {
        alert(getLocalisedString("geoNotSupported"));
    }
}

window.onload = initMap;

// Add event listener to the button to save the current location
document.getElementById('saveLocationBtn').addEventListener('click', saveCurrentLocation);
