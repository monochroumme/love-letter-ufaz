const Room = require('../models/room');
const Player = require('../models/player'); 
var rooms = {};


const io = require('socket.io')();

exports.getIndex = function(req, res, next){
    if(!req.session.isLoggedIn){
        res.render('index', {
            pageTitle: 'Love Letter'
        });
    } else {
        res.render('index', {
            pageTitle: 'Love Letter',
            username: req.session.user.username,
            rooms: rooms
        });
    }
}; //doesn't work this route


exports.getRoom = function(req, res, next){
        res.render('game', {
            pageTitle: 'Love Letter - In Game',
            roomName: req.params.room,
            rooms: rooms
        });
}; // works as '/'


exports.postRoom = function(req, res, next){
    if(rooms[req.body.room] != null){ // checks if room exists or not
        return res.redirect('/'); 
    }
    rooms[req.body.room] = new Room;
    // res.redirect('/api/',req.body.room);
    res.redirect(req.body.room);

    io.emit('room-created', req.body.room);


}; // works as '/:room'



exports.getApiRoom = function(req, res, next){
    if(rooms[req.params.room] == null){
        return res.redirect('/');
    }
    res.render('room', {
        roomName: req.params.room,
        pageTitle: req.params.room,
        user: new Player
    });
}; // works as '/:room'

module.exports.rooms = rooms;