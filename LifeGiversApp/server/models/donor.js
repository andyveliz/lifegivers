var mongoose = require('mongoose');

module.exports = mongoose.model('Donor', {
  name: String,
  phone: String,
  email: String,
  bloodtype: String,
  lat: Number,
  lng: Number,
  ip:String
});