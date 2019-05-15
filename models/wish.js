const mongoose = require('mongoose');


const WishSchema = new mongoose.Schema({
	artistName: String,
	artistId: String,
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
})


module.exports = mongoose.model('Wish', WishSchema);