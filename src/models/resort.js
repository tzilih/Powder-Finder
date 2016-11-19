mongoose = require('mongoose');
require('../database.js');

var resortSchema = new mongoose.Schema({
  name: String,
  description: String,
  website: String,
  snowTotals: Number,
  currentBase: Number,
  coordinates: Array,
  weekly_detailed_forecast: Array
});

Resort = mongoose.model('Resort', resortSchema);

module.exports = Resort;
