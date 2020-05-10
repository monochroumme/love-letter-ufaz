const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const compileSass = require('compile-sass');
const router = require('./back/routes/routes');
var rooms = require('./back/controllers/rooms').rooms;
var Player = require('./back/models/player');

var PORT = process.env.PORT || 3000;
var socket = require('socket.io');

const app = express();

app.use(express.static("res"));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/css/:cssName', compileSass.setup({
    sassFilePath: path.join(__dirname, 'res/scss/'),
    sassFileExt: 'scss',
    embedSrcMapInProd: true,
    resolveTildes: true,
    nodeSassOptions: {
        errLogToConsole: true,
        noCache: true,
        force: true
    }
}));

// to handle errors
app.use(flash());

app.use(router);

const server = app.listen(PORT);
const io = socket(server);
	        
io.on('connection', function(socket){
	console.log('connected to socket', socket.id);
	console.log(rooms);
				
	socket.on('new-user', function(room, username){
		socket.join(room);
		rooms[room].users[socket.id] = new Player;
		socket.to(room).broadcast.emit('user-connected', rooms[room].users[socket.id]);
	});
	
	socket.on('chat', function(data, room){
		io.in(room).emit('chat', data);
	});

	socket.on('typing', function(room, username){
		socket.to(room).broadcast.emit('typing', rooms[room].users[socket.id]);
	});

	socket.on('disconnect', () => {
		getUserRooms(socket).forEach(room => {
			socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id]);
			delete rooms[room].users[socket.id];
		});
	});

});

function getUserRooms(socket){
	return Object.entries(rooms).reduce((names, [name, room]) => {
		if(room.users[socket.id] != null){
			names.push(name);
		}
		return names;
	}, [])
}

console.log("The server started on port", PORT);
// console.log(rooms);