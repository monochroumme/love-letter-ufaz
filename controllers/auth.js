const bcrypt = require('bcryptjs');
const User = require('../models/user');

// const rooms = {};

const nodeMailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodeMailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));



exports.getLogin = function(req, res, next){
    let myErrorMessage = req.flash('error');
    if(myErrorMessage.length > 0){
        myErrorMessage = myErrorMessage[0];
    }else{
        myErrorMessage = null;
    }
    if(!req.session.isLoggedIn){   
        res.render('login', {
            pageTitle: 'Login',
            errorMessage: myErrorMessage // erroy is the key from postLogin
                                         // flash is outputting an array
                                         // so it's safe to use [0] for front
        });
    }else{
        return res.redirect('/');
    }
};

exports.getSignUP = function(req, res, next){
    if(!req.session.isLoggedIn){
        res.render('signUp', {
            pageTitle: 'Sign Up',
            errorMessage: req.flash('error')[0]
        });
    }else{
        return res.redirect('/');
    }
};


const rooms = { name: {}};
exports.getIndex = function(req, res, next){
    if(!req.session.isLoggedIn){
        res.render('index', {
            pageTitle: 'Home',
        });
    }else{
        res.render('afterRegister', {
            pageTitle: 'Love Letter',
            username: req.session.user.username,
            rooms: rooms 
        });
    }
};


exports.getCreatedRoom = function(req, res, next){
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }else{
        res.render('room', {
            pageTitle: 'Game Room',
            roomName: req.params.room
        });
    }
};

exports.postCreatedRoom = function(req, res, next){
    if(rooms[req.body.room] != null){
        return res.redirect('/'); //video 11:16
    }
    rooms[req.body.room] = {users: {}};
    res.redirect(req.body.room);
};


exports.postSignUP = function(req, res, next){
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(password.length < 8 || password.length > 20){
        req.flash('error', 'Password must contain 8 - 20 characters');
        return res.redirect('/signUp');
    }else{
        User.findOne({email: email})
            .then(user => {
                if(user){
                    // console.log("This email is already registered");
                    req.flash('error', 'This email is already registered');
                    return res.redirect('/signUp');
                }else{
                    if(password.toString() !== confirmPassword.toString()){
                        // console.log("Passwords are not equal!");
                        req.flash('error', 'Passwords do not match');
                        return res.redirect('/signUp');
                    }else{
                        return bcrypt
                            .hash(password, 12)
                            .then(hashedPassword => {
                                User.create({email:email, username: username, password: hashedPassword})
                                    .then(result => {
                                        res.redirect('/login');

                                        transporter.sendMail({
                                            to: email,
                                            from: 'notifications@loveletter.com',
                                            subject: 'Love Letter',
                                            html: `<h1>Welcome to Love Letter, dear ${username}</h1>`
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
};

exports.postLogin = function(req, res, next){
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            if(!user){
                // console.log("Password or Email is not correct");
                req.flash('error', 'Invalid email or password.'); // error is key
                res.redirect('/login');
            }else{
                return bcrypt.compare(password, user.password)
                      .then(passwordsMatch => {
                        if(passwordsMatch){
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            return req.session.save(err => {
                                res.redirect('/');
                            });
                        }
                       // console.log("Password or Email is not correct");
                       req.flash('error', 'Invalid email or password.');
                       return res.redirect('/login');
                        
                      })
                      .catch(err => {
                          console.log(err);
                          req.redirect('/login');
                      });
            }
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = function(req, res, next){
    req.session.destroy(err => {
        if(err){
            console.log(err);
        }else{
            return res.redirect('/login');
        }
    });
};
