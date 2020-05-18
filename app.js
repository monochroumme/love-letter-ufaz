const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const compileSass = require('compile-sass');
const router = require('./back/routes/routes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/css/:cssName', compileSass.setup({
    sassFilePath: path.join(__dirname, 'public/scss/'),
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
const socketio = require('socket.io');
const io = socketio(server);
const socketHandler = require('./back/controllers/socketHandler');

socketHandler.setIO(io);
socketHandler.run();

console.log("The server started on port", PORT);
