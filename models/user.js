const mongoose = require('mongoose');
const Concert = require('./concert')


const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  location: String,
  concert: {
  	type: mongoose.Schema.Types.ObjectId,
  	ref: 'Concert'
  }
});


module.exports = mongoose.model('User', UserSchema);