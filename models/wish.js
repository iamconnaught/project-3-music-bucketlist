const mongoose = require('mongoose');


const WishSchema = new mongoose.Schema({
	artistName: String,
	artistId: String
})


module.exports = mongoose.model('Wish', WishSchema);