require('dotenv').config();

const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const cors           = require('cors');
const session        = require('express-session');
const bcrypt 		 = require('bcryptjs')
const methodOverride = require('method-override')
const superagent 	 = require('superagent')


require('./db/db');

//MIDDLEWARE
// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


const corsOptions = {
	origin: process.env.FRONTEND_URL,
	credentials: true,
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

const authController = require('./controllers/authController');
app.use('/auth', authController);


app.get('/', ((req,res, next) => {
	try {
		res.json('HOMEPAGE')
	} catch (err){
		next(err)
	}
}))

const userController = require('./controllers/userController');
app.use('/user', userController)

const concertController = require('./controllers/concertController')
app.use('/concert', concertController)

app.listen(process.env.PORT, () => {
	console.log('listening on port', process.env.PORT);
})


// 
