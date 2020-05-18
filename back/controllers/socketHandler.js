const roomer = require('./rooms');
let io;

function setIO(IO) {
	io = IO;
}

function run() {
	io.on('connection', socket => {
		let roomCode;

		socket.on('room-create', data => {
			roomCode = roomer.create(socket.id, data);
			socket.join(roomCode);
			onRoomCreated(roomCode);
		});

		socket.on('room-connect', data => {
			roomCode = data.roomCode;
			if (roomer.rooms[roomCode]) {
				if (roomer.rooms[roomCode].players.length >= roomer.rooms[roomCode].maxPlayers) {
					sendIndividual(socket.id, 'modal-error', {
						message: `The room is full (max ${roomer.rooms[roomCode].maxPlayers} players)`
					});
				} else {
					socket.join(roomCode);
					roomer.newPlayer(data, socket.id);
					sendIndividual(socket.id, 'room-connected', {
						chat: roomer.rooms[roomCode].chat
					});
					sendAllMessage(roomCode, {
						from: 'SERVER',
						message: `${data.nickname} entered the room`
					});
				}
			} else {
				sendIndividual(socket.id, 'modal-error', {
					message: 'No such room exists'
				});
			}
		});
		
		socket.on('chat-message', msg => {
			sendAllMessage(roomCode, msg);
		});

		// TODO handle user disconnection
		// TODO when rooms are empty, reset nextId in idGenerator to [0,0,0,0,0,0]
		socket.on('disconnect', xz => {
			if (roomer.rooms[roomCode] && roomer.rooms[roomCode].players.find(v => v.playerId == socket.id)) {
				sendAllMessage(roomCode, {
					from: 'SERVER',
					message: `${roomer.rooms[roomCode].players.find(v => v.playerId == socket.id).nickname} left the room`
				});

				if (roomer.rooms[roomCode].hostPlayerId == socket.id && roomer.rooms[roomCode].players.length >= 2) {
					sendAllMessage(roomCode, {
			            from: 'SERVER',
			            message: `${roomer.rooms[roomCode].players[1].nickname} is the new host of the room`
			        })
				}
			}
			roomer.removePlayer(roomCode, socket.id);
		})
	});
}

function onRoomCreated(roomCode) {
	sendIndividual(roomer.rooms[roomCode].hostPlayerId, 'room-host', {});
	sendAll(roomCode, 'room-created', {
		roomCode,
		maxTokens: roomer.rooms[roomCode].maxTokens,
		players: [
			{
				nickname: roomer.rooms[roomCode].players[0].nickname,
				tokens: 0,
				status: 'NOT READY'
			}
		]
	});
	sendAllMessage(roomCode, {
	    from: 'SERVER',
	    message: 'the room was created!'
	});
}

function sendAllMessage(roomCode, message) {
	roomer.rooms[roomCode].chat.push(message);
	sendAll(roomCode, 'chat-message', message);
}

function sendAll(roomCode, api, data) {
	io.in(roomCode).emit(api, data);
}

function sendIndividual(socketId, api, data) {
	io.to(socketId).emit(api, data);
}

module.exports = {
	run,
	setIO,
	sendAllMessage
}
