const mongoose = require('mongoose');

const ConcertSchema = new mongoose.Schema({
	artistName: String,
	venue: String,
	city: String,
	state: String,
	date: Date,
	set: Array,
	setlistId: String,
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}

})


module.exports = mongoose.model('Concert', ConcertSchema);