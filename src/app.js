'use strict';

require('mongoose');
require('./database');
var resort = require('./models/resort.js');
var express = require('express');
var requestJS = require('request');
var schedule = require('node-schedule');
var darksky = require('./scripts/darksky.js');
//only needed once to seed the database
//require('./seed');

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use('/static', express.static(__dirname + '/public/'));

app.listen(process.env.PORT || 5000, function() {
  console.log("The frontend server is running on port 5000!");
});

//json response of all resorts in the db 
app.get('/resorts', function(request, response) {
  Resort.find({}, {} , function(error, resorts) {
    if (error) {
      console.log(error);
    }
    else {
      response.json(resorts);} //TODO - look into res.json in express 5
    });
});

//returns hotels near given coordinates
app.get('/hotels/:coordinates', function(request, response) {
  var coordinates = request.params.coordinates;
  var api_key = 'AIzaSyBFDWYjWAzxzQuOMOyVoljWECu7leC23Lc';
  var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  var api_route = url + '?key=' + api_key + '&location=' + coordinates +
                  '&radius=16000&type=lodging&rankby=prominence';
  requestJS(api_route, function (error, res, body) {
    body = JSON.parse(body);
    response.json(body.results); 
  });
});

//returns hotel details 
app.get('/hotel_details/:placeid', function(request, response){
  var placeid = request.params.placeid;
  var api_key = 'AIzaSyBFDWYjWAzxzQuOMOyVoljWECu7leC23Lc';
  var baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=';
  var place_details_endpoint = baseUrl + placeid + '&key=' + api_key;
  requestJS(place_details_endpoint, function (error, res, body) {
    body = JSON.parse(body);
    response.json(body.result); 
  });
});

app.get('/', function(request, response) {
  response.render('powder');
});

app.get('/mountaincollective', function(request, response) {
  response.render('mountainCollective');
});

app.get('/epic', function(request, response) {
  response.render('epic');
});

app.get('/all', function(request, response) {
  response.render('resorts');
});

//run the darksky forecast script to retrieve new snow totals
var j = schedule.scheduleJob({hour: 4, minute: 30}, function(){
  darksky.getForecast();
});