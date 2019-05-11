const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.get('/', async (req,res, next) => {
	
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

router.get('/:id', async (req,res,next) => {
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

module.exports = router;