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

function searchOnMap() {
  let query = document.getElementById('site-search').value;
  let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        let lat = parseFloat(data[0].lat);
        let lon = parseFloat(data[0].lon);
        // update the iframe
        const mapFrame = document.getElementById('mapFrame');
        mapFrame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.005},${lat-0.005},${lon+0.005},${lat+0.005}&layer=mapnik&marker=${lat},${lon}`;
      } else {
        alert('未找到搜索结果。');
      }
    })
    .catch(error => {
      console.error('搜索出错:', error);
      alert('搜索出错，请稍后再试。');
    });
}

