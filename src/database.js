var mongoose = require('mongoose');
require('./models/resort.js');

mongoose.connect(process.env.MONGODB_URI, function(err) {
  if(err) {
    console.log("Failed connecting to Mongodb!");
  } else {
    console.log("Successfully connected to Mongo!");
  }
});