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
            mapFrame.src = `https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${latitude},${longitude}`;
        }

        window.onload = initMap;
