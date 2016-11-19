var mongoose = require('mongoose');
require('./models/resort.js');
require('./resorts.geojson');

//seeds the database with resorts from resorts.geojson
resortsArray.forEach(function(resort, index) {
  Resort.create({name: resort.properties.name,
  description: resort.properties.description,
  snowTotals: 0,
  currentBase: 0,
  coordinates: resort.geometry.coordinates,
  website: resort.properties.website
  });
});


