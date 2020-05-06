const bcrypt = require('bcryptjs');
const User = require('../models/user');

const nodeMailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodeMailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = function(req, res, next){
    let error = req.flash('error');
    if(error.length > 0){
        error = error[0];
    }else{
        error = null;
    }
    if (!req.session.isLoggedIn){   
        res.render('login', {
            pageTitle: 'Love Letter - Login',
            errorMessage: error // error is the key from postLogin
                                // flash is outputting an array
                                // so it's safe to use [0] for front
        });
    } else {
        return res.redirect('/');
    }
};

exports.getSignup = function(req, res, next){
    if(!req.session.isLoggedIn){
        res.render('signup', {
            pageTitle: 'Love Letter - Sign Up',
            errorMessage: req.flash('error')[0]
        });
    }else{
        return res.redirect('/');
    }
};

exports.postSignup = function(req, res, next){
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(password.length < 8 || password.length > 20){
        req.flash('error', 'Password must contain 8 - 20 characters');
        return res.redirect('/signup');
    } else {
        User.findOne({email: email})
            .then(user => {
                if(user){
                    // console.log("This email is already registered");
                    req.flash('error', 'This email is already registered');
                    return res.redirect('/signup');
                }else{
                    if(password.toString() !== confirmPassword.toString()){
                        // console.log("Passwords are not equal!");
                        req.flash('error', 'Passwords do not match');
                        return res.redirect('/signup');
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
