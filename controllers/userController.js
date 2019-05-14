const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Wish = require('../models/wish')
const superagent = require('superagent')

router.get('/', async (req, res, next) => {
	
	console.log("session: ", req.session);

	try {
		if(!req.session.loggedIn){
			res.json({
				data: "not logged in"
			})
		}

		const foundUsers = await User.find({})
		res.json({
			data: foundUsers
		})
	} catch (err){
		next(err)
	}
})

router.get('/:id', async (req, res, next) => {
	try {
		if(!req.session.loggedIn){
			res.json({
				data: "not logged in"
			})
		}
		const foundUser = await User.findById(req.params.id);
		res.json(foundUser.username)
	} catch (err){
		next(err)
	}
})

router.get('/search/:artist', (req, res, next) => {
	superagent
		.get(`https://api.setlist.fm/rest/1.0/search/artists?artistName=${req.params.artist}&p=1&sort=sortName`)
		.set('X-API-key', '42RVoNqJ0gn6Z4U6iagd4VbMJ2WA2REmLjOP')
		.set('Accept', 'application/json')
		.then((data) => {
			console.log(data.text);
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

// made this route to help figure out syntax for post route below
// router.get('/search/:id', (req, res, next) => {
// 	superagent
// 		.get(`https://api.setlist.fm/rest/1.0/artist/${req.params.id}`)
// 		.set('X-API-key', '42RVoNqJ0gn6Z4U6iagd4VbMJ2WA2REmLjOP')
// 		.set('Accept', 'application/json')
// 		.then((data) => {
// 			console.log(data.text);
// 			const actualData = JSON.parse(data.text)
// 			// const justTheDataIWant = actualData.artist.map(artist =>{
// 			// 	return{
// 			// 		name: artist.name,
// 			// 		mbid: artist.mbid
// 			// 	}
// 			// })
// 			res.status(200).json({
// 				status: 200,
// 				data: actualData
// 			})
// 		}).catch((error) => {
// 			next(error)
// 			// res.status(400).json({
// 			// 	status: 400,
// 			// 	error: error
// 			// })
// 		})
// })

router.post('/newWish/:id', async (req, res, next) => {
	try {
		// if(!req.session.loggedIn){
		// 	res.json({
		// 		data: "not logged in"
		// 	})
		// }
		
		thisWish = new Wish({
			artistId: req.params.id
		})
		superagent
			.get(`https://api.setlist.fm/rest/1.0/artist/${req.params.id}`)
			.set('X-API-key', '42RVoNqJ0gn6Z4U6iagd4VbMJ2WA2REmLjOP')
			.set('Accept', 'application/json')
			.then((data) => {
				// console.log(data);
				const actualData = JSON.parse(data.text)
				thisWish.artistName = actualData.name
				thisWish.save((err, data) => {
					res.json({
						artistName: thisWish.artistName
					})
				})
			})
		
	} catch (err){
		next(err)
	}
	
})


module.exports = router;