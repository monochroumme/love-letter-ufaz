const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter');
const app = express();
const mongoose = require('mongoose');
const url = 'mongodb+srv://Rufat:rufik1115@cluster0-haajy.mongodb.net/Practice';
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); //session - express-session
const flash = require('connect-flash');
var PORT = process.env.PORT || 3000;

const csrf = require('csurf');
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended:false}));

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
        app.listen(PORT);
        console.log("MongoDB Connected!");
    })
    .catch(err => {
        console.log(err);
    });

console.log("The server started on port", PORT);
