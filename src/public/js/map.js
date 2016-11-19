var map = L.map('map').setView([44, -97], 5);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidHppbGloIiwiYSI6ImNpa2ExdHlldDBoZ3d2amtwdnhtMW5saTMifQ.P0zwMM9l6JPGY6f6KMPXsQ'
}).addTo(map);