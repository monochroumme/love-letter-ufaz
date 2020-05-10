const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const api = require('../controllers/api');
const rooms = require('../controllers/rooms');

// GET requests
// router.get('/', api.index);
// router.get('/:room', api.room);


router.get('/', rooms.getRoom); // index 

router.post('/:room', rooms.postRoom);
router.get('/:room', rooms.getApiRoom);
module.exports = router;