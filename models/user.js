const mongoose = require('mongoose');
const Concert = require('./concert');
const Wish = require('./wish')


const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  location: String,
  concert: {
  	type: mongoose.Schema.Types.ObjectId,
  	ref: 'Concert'
  },
  wish: {
  	type: mongoose.Schema.Types.ObjectId,
  	ref: 'Wish'
  }
});


module.exports = mongoose.model('User', UserSchema);