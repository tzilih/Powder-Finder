var mtn_col_resorts = [
                        "Mammoth", 
                        "Alta",
                        "Snowbird",
                        "Aspen", 
                        "Jackson Hole Ski Resort", 
                        "Banff National Park",
                        "Revelstoke Mountain Resort",
                        "Squaw Valley",
                        "Alpine Meadows",
                        "Stowe",
                        "Sun Valley",
                        "Taos",
                        "Telluride",
                        "Whistler"
                      ];

$('document').ready(function() {
  $('.active').removeClass('active');
  $('#collective').addClass('active');
  $.ajax('/resorts').done(function(response) {
    response.forEach(function(resort) {
      var name = resort.name;
      for (n = 0; n < mtn_col_resorts.length; n++) {
            if (name == mtn_col_resorts[n]) {
                  var lat = resort.coordinates[1];
                  var lng = resort.coordinates[0];
                  var id = resort._id;
                  var snowTotals = resort.snowTotals;
                  var website = resort.website;
                  if (snowTotals > 0) {
                    var resortMarker = L.ExtraMarkers.icon({
                      icon: 'fa-number',
                      markerColor: 'blue',
                      shape: 'circle',
                      prefix: 'fa',
                      number: (Math.round(snowTotals)) + '"'
                    });

                    var icons = {
                      "snow": "sleet.svg",
                      "partly-cloudy-night": "partly-cloudy-night.svg",
                      "partly-cloudy-day": "partly-cloudy-day.svg",
                      "clear-day": "sunny.svg",
                      "clear-night": "clear-night.svg",
                      "rain": "rain.svg",
                      "wind": "wind.svg",
                      "sleet": "sleet.svg",
                      "fog": "cloudy.svg",
                      "cloudy": "cloudy.svg",
                      "simple": "partly-cloudy-day.svg",
                    }; 
                    //create forecast table
                    var formatted_forecast = '';
                    for (i=0; i < resort.weekly_detailed_forecast.length - 1; i++) {
                      //add 18000 to the unix timestamp to offset difference in timezone
                      var weekday = new Date((resort.weekly_detailed_forecast[i].time + 18000) * 1000);
                      var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                      var day = days[weekday.getDay()];
                      formatted_forecast += '<tr><td>' + day + ': ';
                      var precipAccumulation = resort.weekly_detailed_forecast[i].precipAccumulation;
                      if (typeof precipAccumulation != 'undefined') {
                        precip_total = Math.floor(precipAccumulation) + '-' + Math.ceil(precipAccumulation) + '"';;
                      } else {
                        precip_total = '0"';
                      }
                      formatted_forecast += precip_total;
                      var low_temp = Math.round(resort.weekly_detailed_forecast[i].temperatureMin);
                      var high_temp = Math.round(resort.weekly_detailed_forecast[i].temperatureMax);
                      formatted_forecast += ' Lo: ' + low_temp + ' Hi: ' + high_temp +'<br>';
                      formatted_forecast += resort.weekly_detailed_forecast[i].summary + '<br>';
                      var icon = icons.simple;
                      if (resort.weekly_detailed_forecast[i].icon) {
                        icon = icons[resort.weekly_detailed_forecast[i].icon];
                      }
                      var icon_tag = '<img width="35" height="35" src="../../static/css/images/' + icon + '">';
                      formatted_forecast += icon_tag + '</td></tr>';
                    }
                 
                    popupContents =  '<div id=' + lat + '>' + '<h4>' + resort.name +'</h4>';
                    popupContents += '<h5 id="resort-url"><a target="_blank" href="' + website + '">' + website +'</a></h5>';
                    popupContents += '<table class="table table-striped"><tbody>' + formatted_forecast  + '</tbody></table>';
                    popupContents += '<button id="hotel-button" class="btn btn-info" onclick="getHotels(' + lat +',' + lng +')">Find Nearby hotels</button>';
                    popupContents += '<br>' + '</div>';
                    var resortMarker = L.marker([lat,lng], {"icon": resortMarker, "riseOnHover":true}).addTo(map);
                    resortMarker.bindPopup(popupContents).openPopup;
                    resortMarker.on('click', function(e) {
                      var lat = e.latlng.lat + 5;
                      var lng = e.latlng.lng;
                      map.setView([lat,lng], 5);
                    });
                  }
            }
      }
    });
  });
});

//calls google places API to retrieve nearby hotels
function getHotels(lat, lng) {
    var popup = document.getElementById(lat);
    $(popup).append("<div id='hotel-list'></div>");
    var baseUrl = '/hotels/'
    var endpoint = baseUrl + lat + ',' + lng;
    $.ajax(endpoint).done(function(response) {
      for (var n=0; n < 5; n++) {
        var hotel = response[n];
        var placeid = hotel.place_id;
        getHotelDetails(placeid, lat);
      }
    });
};

function getHotelDetails(placeid, lat) {
  var baseUrl = '/hotel_details/';
  var endpoint = baseUrl + placeid;
  $.ajax(endpoint).done(function(response) {
    var website = response.website;
    var hotel_name = response.name;
    var rating = response.rating;
    var photoreference = response.photos[0].photo_reference;
    addHotelDetails(hotel_name, website, lat, rating, photoreference);
  });
};

function addHotelDetails(hotel_name, website, lat, rating, photoreference) {
  var hotel_list = document.getElementById('hotel-list');
  var baseUrl = 'https://maps.googleapis.com/maps/api/place/photo?'
  var api_key = 'AIzaSyBFDWYjWAzxzQuOMOyVoljWECu7leC23Lc';
  var photo_link = baseUrl + 'key=' + api_key + '&maxheight=80&maxwidth=80&photoreference=' +
    photoreference;
  $(hotel_list).append("<h5>" + hotel_name + "</h5>" + '<h6>Rating: ' + rating + '/5</h6>' + 
    '<h6><a id="hotel_url" target="_blank" href="' + website + '">' + website + "</a></h6>" +
    '<img src="' + photo_link + '">');     
}