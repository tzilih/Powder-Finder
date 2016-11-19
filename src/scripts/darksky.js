var request = require("request");
require('mongoose');
require('../database');
var resort = require('../models/resort.js');

var url = 'https://api.darksky.net/forecast',
    api_key = '5eadb50d1f78c301cf8831741c252d78';

//query db for every resort and pass to darkSkyForecast()
function getForecast() {
  Resort.find({} ,{}, function(error, resorts) {
      if (error) return console.log(error);
      resorts.forEach(function(location) {
        darkSkyForecast(location._id, location.snowTotals, location.coordinates[1], location.coordinates[0]);
      });
    });
}

//get resort forecast for next 7 days and update db
function darkSkyForecast(id, snowTotals, lat, lng) {
  var api_route = url + '/' + api_key + '/' + lat + ',' + lng;
  request(api_route, function (error, response, body) {
    var parsed_response = JSON.parse(body);
    var weekly_forecast = parsed_response.daily.data;
    var weekly_total = 0;
    for (i = 0; i < weekly_forecast.length; i++) {
      if (typeof weekly_forecast[i].precipAccumulation != 'undefined') {
        weekly_total += weekly_forecast[i].precipAccumulation;
      }  
    }
    weekly_total = Math.round(weekly_total);
      updateSnowTotals(id, weekly_total, weekly_forecast);
  });  
}

//update resort forecast in db
function updateSnowTotals(id, weekly_total, weekly_forecast) {
  console.log("updating: " + id);
  Resort.update({ _id: id }, { $set: { snowTotals: weekly_total, weekly_detailed_forecast: weekly_forecast }}).exec();
}

module.exports.getForecast = getForecast;