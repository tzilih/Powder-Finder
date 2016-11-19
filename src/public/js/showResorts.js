$('document').ready(function() {
  $('.active').removeClass('active');
  $('#all').addClass('active');
  $.ajax('/resorts').done(function(response) {
    response.forEach(function(resort) {
      var name = resort.name;
      var lat = resort.coordinates[1];
      var lng = resort.coordinates[0];
      var website = resort.website;
      var resortMarker = L.ExtraMarkers.icon({
          icon: 'fa-number',
          markerColor: 'blue',
          shape: 'circle',
          prefix: 'fa',
        });
      var marker = L.marker([lat, lng], {"icon": resortMarker, riseOnHover: true}).addTo(map);
      
      popupContents =  '<div id=' + lat + '>' + '<h4>' + name +'</h4>';
      popupContents += '<h5 id="resort-url"><a target="_blank" href="' + website + '">' + website +'</a></h5>';
      marker.bindPopup(popupContents).openPopup;
      marker.on('click', function(e) {
                      var lat = e.latlng.lat + 5;
                      var lng = e.latlng.lng;
                      map.setView([lat,lng], 5);
                    });
    });
  });
});

