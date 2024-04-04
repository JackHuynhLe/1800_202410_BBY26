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
    mapFrame.src = generateMapURL(latitude, longitude, 0.01, 0.01);
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

window.onload = initMap;

/**
 * Interactive functions of the map in the main.html
 */
{
    /**
     * Function to get the current location of the user
     */
    const currentLocationBtn = document.getElementById('currentLocationBtn');
    currentLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, handleError);
        } else {
            alert(getLocalisedString("geoNotSupported"));
        }
    });
}