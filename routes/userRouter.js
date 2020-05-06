const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');


// const isAuth = require('../middleware/isAuth');
// use this where needed!
// router.get('/login', isAuth, authController.getLogin);


// Login page with GET request 
router.get('/login', authController.getLogin);

// SignUP page with GET request
router.get('/signUP', authController.getSignUP);

// StayHome with GET request
router.get('/', authController.getIndex);

// SignUP with POST request
router.post('/signUP', authController.postSignUP);

// LogIN with POST request
router.post('/login', authController.postLogin);

// after Registration Home page
// router.get('/home', authController.getGotSession);

// after Registration Log OUT
router.post('/', authController.postLogout);

router.get('/:room', authController.getCreatedRoom);

module.exports = router;