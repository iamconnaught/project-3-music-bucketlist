const express = require('express');
const router = express.Router();
const User = require('../models/user');
const session = require('express-session');
const bcrypt = require('bcryptjs')

// router.get('/', async ((req,res, next) => {
	
// }))


router.post('/register', async (req,res, next) => {
	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

	const userDbEntry = {};
	userDbEntry.username = req.body.username;
	userDbEntry.password = passwordHash;
	userDbEntry.location = req.body.location

	try {
		const createdUser = await User.create(userDbEntry);	
		req.session.loggedIn = true;
		req.session.userDbId = createdUser._id;
		console.log(createdUser);

		console.log(req.session)

		res.json({
			status: 200,
			data: createdUser
		});

		// res.redirect('/users/' + createdUser._id)
	} catch (err){
		next(err)
	}
})

router.post('/login', async (req,res, next) => {
	try {
		const foundUser = await User.findOne({'username': req.body.username});
		if(foundUser){
			if(bcrypt.compareSync(req.body.password, foundUser.password)){
				req.session.message = '';
				req.session.loggedIn = true;
				req.session.userDbId = foundUser._id;

				console.log(req.session);

				res.json({
					status: 200,
					data: foundUser
				})
			}

			else{
				req.session.message = "Username or Password incorrect"
			}
		} else {
			req.session.message = "Username or Password incorrect"
		}
	} catch (err){
		next(err)
	}
})

router.get('/logout', (req,res,next) => {
	console.log('logout endpoint hit');
	req.session.destroy((err) => {
		if (err) {
			next(err)
		} else{
			res.json({
				status:200,
				data: "logged out"
			})
		}
	})
	
})



module.exports = router;