const Room = require('../models/room');
const Player = require('../models/player');
const idGenerator = require('../utils/id-generator');
const io = require('socket.io')();

let rooms = [];
module.exports.rooms = rooms;

exports.create = (playerId, data) => {
    let roomCode = idGenerator.new();
    rooms[roomCode] = new Room(roomCode, data.roomSize, data.roomStatus, playerId);
    rooms[roomCode].players.push(new Player(data.nickname, playerId));
    return roomCode;
};

exports.newPlayer = (data, playerId) => {
    rooms[data.roomCode].players.push(new Player(data.nickname, playerId));
};

exports.removePlayer = (roomCode, playerId) => {
    if (!rooms[roomCode])
        return;

    rooms[roomCode].players.splice(0, 1); // host is always the first players

    // if the room has no players anymore, then remove the room
    if (rooms[roomCode].players.length == 0) {
        delete rooms[roomCode];
        return;
    }

    // if the removed player was the host, then assign the host role to another player
    if (rooms[roomCode].hostPlayerId == playerId) {
        rooms[roomCode].hostPlayerId = rooms[roomCode].players[0].playerId;
    }
};

