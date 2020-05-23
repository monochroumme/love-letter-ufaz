const roomer = require('./rooms');
let io;

function setIO(IO) {
	io = IO;
}

function run() {
	io.on('connection', socket => {
		let roomCode;

		socket.on('room-create', data => {
			roomCode = roomer.create(socket, data);
			socket.join(roomCode);
			onRoomCreated(roomCode);
		});

		socket.on('room-connect', data => {
			roomCode = data.roomCode.toUpperCase();

			// does the room exist?
			if (roomer.rooms[roomCode]) {
				// are there enough places in the room?
				if (roomer.rooms[roomCode].players.length < roomer.rooms[roomCode].maxPlayers) {
					// connect to the room
					socket.join(roomCode);
					// create a new player
					roomer.newPlayer(data, socket);
					// send chat and room modal data
					sendIndividual(socket.id, 'room-connected', {
						chat: roomer.rooms[roomCode].chat,
						roomModalData: roomer.rooms[roomCode].getRoomModalData(roomCode)
					});
					// broadcast that the user was connected
					sendAllMessage(roomCode, {
						from: 'SERVER',
						message: `${data.nickname} entered the room`
					});
					// update everyone's room modal except the current player
					sendAllExcept(socket, roomCode, 'update-room-modal', roomer.rooms[roomCode].getRoomModalData(roomCode));
				} else {
					// are a disconnected player?
					if (roomer.rooms[roomCode].isDisconnectedPlayer(socket.id)) {
						// what is the game state?
						if (roomer.rooms[roomCode].inGame) {
							// TODO wait
							sendAllMessage(roomCode, {
								from: 'SERVER',
								message: `${data.nickname} returned to the room`
							});
						} else {
							// make the player connected
							roomer.rooms[roomCode].players.find(v => v.playerId == socket.id).isConnected = true;
							// send the player the chat and the room modal data
							sendIndividual(socket.id, 'room-connected', {
								chat: roomer.rooms[roomCode].chat,
								roomModalData: roomer.rooms[roomCode].getRoomModalData(roomCode)
							});
						}
					} else {
						sendIndividual(socket.id, 'modal-error', {
							message: `The room is full (max ${roomer.rooms[roomCode].maxPlayers} players)`
						});
					}
				}
			} else {
				sendIndividual(socket.id, 'modal-error', {
					message: 'No such room exists'
				});
			}
		});

		socket.on('chat-action', cardIndex => {
			roomer[roomCode].handleChatAction(socket.id, cardIndex);
		});
		
		socket.on('chat-message', msg => {
			sendAllMessage(roomCode, msg);
		});

		socket.on('update-ready', status => {
			// is it the host? and is the game not already running?
			if (socket.id == roomer.rooms[roomCode].hostPlayerId && !roomer.rooms[roomCode].started) {
				// is everyone ready?
				if (roomer.rooms[roomCode].isEveryoneReady()) {
					// TODO start the game
					// update the ready status of the player
					roomer.rooms[roomCode].players.find(v => v.playerId == socket.id).isReady = status;
					// update everyone's room modal
					sendAll(roomCode, 'update-room-modal', roomer.rooms[roomCode].getRoomModalData(roomCode));
					roomer.rooms[roomCode].startGame();
				}
			} else {
				// update the ready status of the player
				roomer.rooms[roomCode].players.find(v => v.playerId == socket.id).isReady = status;
				// update the player's ready button
				sendIndividual(socket.id, 'update-ready-player-button', status);
				// update everyone's room modal
				sendAll(roomCode, 'update-room-modal', roomer.rooms[roomCode].getRoomModalData(roomCode));
			}
		});

		// TODO handle user disconnection
		socket.on('disconnect', xz => {
			// if (roomer.rooms[roomCode] && roomer.rooms[roomCode].players.find(v => v.playerId == socket.id)) {
			// 	sendAllMessage(roomCode, {
			// 		from: 'SERVER',
			// 		message: `${roomer.rooms[roomCode].players.find(v => v.playerId == socket.id).nickname} left the room`
			// 	});

			// 	if (roomer.rooms[roomCode].hostPlayerId == socket.id && roomer.rooms[roomCode].players.length >= 2) {
			// 		sendAllMessage(roomCode, {
			//             from: 'SERVER',
			//             message: `${roomer.rooms[roomCode].players[1].nickname} is the new host of the room`
			//         })
			// 	}
			// }
			// roomer.removePlayer(roomCode, socket.id);
		})
	});
}

function onRoomCreated(roomCode) {
	sendIndividual(roomer.rooms[roomCode].hostPlayerId, 'room-host', {});
	sendAll(roomCode, 'room-connected', {
		chat: roomer.rooms[roomCode].chat,
		roomModalData: roomer.rooms[roomCode].getRoomModalData(roomCode)
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

function sendAllExcept(socket, roomCode, api, data) {
	socket.to(roomCode).emit(api, data);
}

module.exports = {
	run,
	setIO,
	sendAllMessage,
	sendAll,
	sendIndividual,
	sendAllExcept
}
