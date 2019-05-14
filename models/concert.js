const mongoose = require('mongoose');

const ConcertSchema = new mongoose.Schema({
	artistName: String,
	venue: String,
	city: String,
	state: String,
	date: Date,
	set: Array,
	setlistId: String,

})


module.exports = mongoose.model('Concert', ConcertSchema);