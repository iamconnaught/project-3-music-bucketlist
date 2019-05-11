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

module.exports = router;