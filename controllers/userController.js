const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Wish = require('../models/wish')
const superagent = require('superagent')

// INDEX OF USERS
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

// USER PROFILE
router.get('/:id', async (req, res, next) => {

	try {
		if(!req.session.loggedIn){
			res.json({
				data: "not logged in"
			})
		} else {
			const foundUser = await User.findById(req.session.userDbId).populate('wishlist');
			res.status(200).json(foundUser)
			
		}
	} catch (err){
		next(err)
	}
})

// SEARCH FOR ARTIST FOR WISHLIST
router.get('/search/:artist', (req, res, next) => {
	console.log("searching in userController for artist: ", req.params.artist)
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


// POST ROUTE FOR WISHLIST
router.post('/newWish/:id', async (req, res, next) => {
	try {
		// if(!req.session.loggedIn){
		// 	res.json({
		// 		data: "not logged in"
		// 	})
		// }
		
		// find current user based on session 
		// 

		console.log("session: ", req.session);

		const currentUser = await User.findById(req.session.userDbId)


		const thisWish = new Wish({
			artistId: req.params.id,
			ownerId: currentUser
		})
		await thisWish.save()
		currentUser.wishlist.push(thisWish)
		await currentUser.save()
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