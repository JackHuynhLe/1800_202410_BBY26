import {auth, db} from './firebaseInit.js'
import {
    collection,
    getDocs,
    query
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

/**
 * Function to display location on a map in history page.
 *
 * @param latitude latitude
 * @param longitude longitude
 * @return {Promise<void>} Promise.
 */
async function displayLocationOnMap(latitude, longitude) {
    const mapSection = document.getElementById('mapSection');
    if (mapSection) {
        try {
            mapSection.innerHTML = `
            <div class="map-container">
                <iframe id="mapFrame" width="600" height="450" style="border:0;"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude -
            0.001},${latitude - 0.001},${longitude + 0.001},${latitude +
            0.001}&layer=mapnik&marker=${latitude},${longitude}">
                </iframe>
            </div>`;

        } catch (error) {
            console.error("Error fetching reverse geocode data:", error);
        }
    } else {
        console.error("mapSection element not found in the DOM");
    }
}


/**
 * Function to display locations in a table
 *
 * @param locationArray array of locations
 * @return {Promise<void>} Promise.
 */
async function displayLocationsInTable(locationArray) {
    /* At the first time I want to make community history as well, so I name this ID so long,
    but no time to do this. */
    const travelHistoryContainer = document.getElementById('travelHistoryContainer');

    const locationPromises = locationArray.map(location => {
        const [date, time] = location.dateTime.split(" ");
        const userDIYName = location.locationName;
        const latitude = location.latitude;
        const longitude = location.longitude;
        const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

        return fetch(reverseGeocodeUrl)
            .then(response => response.json())
            .then(data => {
                const address = data.address;
                const city = address.city ?? address.town ?? address.village ?? address.hamlet ??
                    address.suburb ?? '';
                const province = address.state ?? address.county ?? '';
                const country = address.country ?? '';
                const postcode = address.postcode ?? '';
                const locationName = address.name ?? userDIYName;

                return `
                    <div class="historyContext">
                      <div class="locationInfo">
                        <div class="locationName">${locationName}</div>
                        <div class="locationAddress">${city} ${province} ${country} ${postcode}</div>
                      </div>
                      <div class="timeInfo">
                        <div class="date">${date}</div>
                        <div class="time">${time}</div>
                      </div>
                      <button class="viewOnMapBtn">
                        <span class="lang-text" data-key="viewOnMap">View on map</span>
                      </button>
                    </div>
                `;
            });
    });

    /**
     * Use Promise.all to wait for all promises to resolve before displaying the HTML.
     *
     * @param locationPromises array of promises for each location.
     */
    Promise.all(locationPromises)
        .then(htmlStrings => {
            travelHistoryContainer.innerHTML = htmlStrings.join('');

            const viewOnMapBtn = document.querySelectorAll('.viewOnMapBtn');
            const historyMapContainer = document.getElementById('historyMapContainer');
            const historySelectContainer = document.getElementById('historySelectContainer');

            viewOnMapBtn.forEach(btn => {
                btn.addEventListener('click', async () => {
                    const locationName = btn.closest('.historyContext')
                        .querySelector('.locationName').textContent;
                    const location = locationArray.find(
                        location => location.locationName === locationName);
                    if (location) {
                        historyMapContainer.classList.remove('initiallyHidden');
                        historySelectContainer.classList.add('initiallyHidden');
                        await displayLocationOnMap(location.latitude, location.longitude);
                    } else {
                        console.error('Location not found for:', locationName);
                    }
                });
            });
        })
        .catch(error => {
            console.error("Error processing locations:", error);
        });

}

/**
 * Event listener to fetch user locations when the button is clicked.
 */
document.getElementById('travelHistoryBtn').addEventListener('click', async () => {
    await fetchUserLocations();
});

/**
 * Event listener to fetch user locations when the page loads; I don't think this function works.
 * TODO: Function does not work
 */
document.addEventListener('DOMContentLoaded', async () => {
    await fetchUserLocations();
});

/**
 * Function to fetch user locations
 *
 * @return {Promise<void>} Promise.
 */
async function fetchUserLocations() {
    const locationArray = [];
    const user = auth.currentUser;

    if (user) {
        console.log(`Found user: ${user.uid}`);
        const locationRef = collection(db, "users", user.uid, "locations");
        console.log("Accessing user locations collection...");
        const q = query(locationRef);

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.log("Found location documents.");
        } else {
            console.log("No location documents found.");
        }

        querySnapshot.forEach((doc) => {
            locationArray.push({id: doc.id, ...doc.data()});
        });

        await displayLocationsInTable(locationArray);
    } else {
        console.log("No user is signed in.");
    }
}
