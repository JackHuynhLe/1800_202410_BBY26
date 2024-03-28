function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const mapFrame = document.getElementById('mapFrame');
    mapFrame.src =
      `https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${latitude},${longitude}`;
}

window.onload = initMap;

/**
 * Function to search the given query on the map and update the iframe with the result.
 */
function searchOnMap() {
    let query = document.getElementById('site-search').value;
    let url =
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
          if (data.length > 0) {
              let lat = parseFloat(data[0].lat);
              let lon = parseFloat(data[0].lon);
              // update the iframe
              const mapFrame = document.getElementById('mapFrame');
              mapFrame.src =
                `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.005},
                ${lat - 0.005},${lon + 0.005},${lat + 0.005}&layer=mapnik&marker=${lat},${lon}`;
          } else {
              alert('No results found. Please try again.');
          }
      })
      .catch(error => {
          console.error('Search error:', error);
          alert('Search error. Please try again.');
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
            alert('Current location saved successfully!');
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Add event listener to the button to save the current location
document.getElementById('saveLocationBtn').addEventListener('click', saveCurrentLocation);
