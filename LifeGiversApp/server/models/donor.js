var mongoose = require('mongoose');

module.exports = mongoose.model('Donor', {
  name: String,
  phone: String,
  email: String,
  bloodType: String,
  lat: Number,
  lng: Number
});