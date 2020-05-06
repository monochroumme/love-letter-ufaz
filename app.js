const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const compileSass = require('compile-sass');
const userRouter = require('./back/routes/routes');
const {userJoin, getCurrentUser} = require('./back/utils/users');

const mongoose = require('mongoose');
const url = 'mongodb+srv://Rufat:rufik1115@cluster0-haajy.mongodb.net/Practice';
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); //session - express-session

const app = express();

app.use(express.static("res"));

var PORT = process.env.PORT || 3000;
var socket = require('socket.io');

const csrf = require('csurf');
const csrfProtection = csrf();

app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.set('views', 'views'); //2nd views is my folder

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


const store = new MongoDBStore({
    uri: url, // url is above (mongodb database) (Practice database - if 2 db , then 2 uri)
    collection: 'sessions'
});

// resave:false - session won't be saved in every request has been done
// saveUninitialized:false - nothing changed so no save
app.use(
    session(
        {
            secret: 'secret',
            resave: false,
            saveUninitialized: false,
            store: store // 2nd store is our MongoDBStore object
        }
    )
);

// app.use(csrfProtection);

app.use(flash());

// app.use((req, res, next) => {
//     res.locals.isAuthenticated = req.session.isLoggedIn;
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

app.use(userRouter);

mongoose
    .connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(result => {
        const server = app.listen(PORT);

        const io = socket(server);
        
        
        io.on('connection', function(socket){

            const users = {}
            
            // io.on('joinRoom', function(username, room){

                socket.on('chat', function(data){
                    io.sockets.emit('chat', data);
                });
    
                socket.on('typing', function(data){
                    socket.broadcast.emit('typing', data);
                });
                

                socket.on('disconnect', function(){
                    socket.broadcast.emit('user-disconnected', users[socket.id]);
                    delete users[socket.id];
                });

                socket.on('new-user', function(username){
                    users[socket.id] = username;
                    socket.broadcast.emit('user-connected', username);
                });

            // }); // end of io joinRoom
            
        });  // end of io connection

        console.log("MongoDB Connected!");
    })
    .catch(err => {
        console.log(err);
    });

console.log("The server started on port", PORT);

module.exports = PORT;
