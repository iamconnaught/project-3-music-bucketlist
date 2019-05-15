const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Concert = require('../models/concert')
const superagent = require('superagent')


// API CALL THAT SEARCHES FOR ARTISTS
router.get('/search/:artist', (req, res, next) => {
	superagent
		.get(`https://api.setlist.fm/rest/1.0/search/artists?artistName=${req.params.artist}&p=1&sort=sortName`)
		.set('X-API-key', '42RVoNqJ0gn6Z4U6iagd4VbMJ2WA2REmLjOP')
		.set('Accept', 'application/json')
		.then((data) => {
			// console.log(data.text);
			const actualData = JSON.parse(data.text)
			const justTheDataIWant = actualData.artist.map(artist =>{
				return{
					name: artist.name,
					mbid: artist.mbid
				}
			})
			res.status(200).json({
				status: 200,
				data: justTheDataIWant
			})
		}).catch((error) => {
			next(error)
			// res.status(400).json({
			// 	status: 400,
			// 	error: error
			// })
		})
})

// API CALL THAT SEARCHES FOR ARTISTS' SETLISTS
router.get('/search/setlist/:artist', (req, res, next) => {

	console.log("searching in concertController for artist: ", req.params.artist)

	superagent
		.get(`https://api.setlist.fm/rest/1.0/search/setlists?artistName=${req.params.artist}&p=1&sort=sortName`)
		.set('X-API-key', '42RVoNqJ0gn6Z4U6iagd4VbMJ2WA2REmLjOP')
		.set('Accept', 'application/json')
		.then((data) => {
			// console.log(data.text);
			const actualData = JSON.parse(data.text)
			const justTheDataIWant = actualData.setlist.map(setlist =>{
				return{
					artist: setlist.artist.name,
					id: setlist.id,
					venue: setlist.venue.name,
					city: setlist.venue.city.name,
					state: setlist.venue.city.state,
					date: setlist.eventDate,
					set: setlist.sets.set.map(set => {
						return {
							song: set.song.map(song => {
								return {
									name: song.name
								}
							})
						}
					})

				}
			})
			res.status(200).json({
				status: 200,
				data: justTheDataIWant
			})
		}).catch((error) => {
			// next(error)
			res.status(400).json({
				status: 400,
				error: error
			})
		})
})



// user attended a concert with
// POST ROUTE FOR SETLIST
router.post('/new/:id', async (req, res, next) => {
	try {
		// if(!req.session.loggedIn){
		// 	res.json({
		// 		data: "not logged in"
		// 	})

		// }

		const currentUser = await User.findById(req.session.userDbId)
		
		thisConcert = new Concert({
			setlistId: req.params.id,
			ownerId: currentUser
		})

		await thisConcert.save()
		currentUser.concerts.push(thisConcert)
		await currentUser.save()

		superagent
			.get(`https://api.setlist.fm/rest/1.0/setlist/${thisConcert.setlistId}`)
			.set('X-API-key', '42RVoNqJ0gn6Z4U6iagd4VbMJ2WA2REmLjOP')
			.set('Accept', 'application/json')
			.then((data) => {
				// console.log(data);
				const actualData = JSON.parse(data.text) 
				thisConcert.artistName = actualData.artist.name
				thisConcert.venue = actualData.venue.name
				thisConcert.city = actualData.venue.city.name
				thisConcert.state = actualData.venue.city.state
				thisConcert.date = actualData.eventDate
				thisConcert.set = actualData.sets.set
				

				thisConcert.save((err, data) => {
					
					res.json({
						artistName: thisConcert.artistName,
						venue: thisConcert.venue,
						city: thisConcert.city,
						state: thisConcert.state,
						date: thisConcert.date,
						set: thisConcert.set
						// ownerId: req.session.userDbId
					})					
				})
			})

		// api call -- get the setlist based on id


		// this concert save

		// res json whatever, success, this concert

	} catch (err){
		next(err)
	}
})

module.exports = router;