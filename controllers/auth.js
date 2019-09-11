const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const utils = require('./../util/utils');
const BASE_URL = process.env['BASE_URL'];
const API_EMAIL = process.env['API_EMAIL'];
const mongoose = require('mongoose');
const Email = require('email-templates');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: API_EMAIL
    }
}));

exports.getSignup = (req, res, next) => {
    const errorMessage = utils.getFlashMessage(req, 'error');
    res.render("shop/signup", {
        docTitle: "Signup",
        path: "/signup",
        errorMessage: errorMessage,
    });
};

exports.getLogin = (req, res, next) => {
    const errorMessage = utils.getFlashMessage(req, 'error');
    res.render("shop/login", {
        docTitle: "Login",
        errorMessage: errorMessage,
        path: "/login"
    });
};

exports.getReset = (req, res, next) => {
    const errorMessage = utils.getFlashMessage(req, 'error');
    res.render("shop/reset", {
        docTitle: "Reset password",
        errorMessage: errorMessage,
        path: "/reset"
    });
};

exports.postReset = (req, res, next) => {
    let username;
    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
            console.log(error);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No user with that mail found.');
                    return res.redirect('/reset');
                }
                username = user.username;
                user.resetToken = token;
                user.resetTokenExp = Date.now() + 3600000;
                user.save();
            })
            .then((result) => {
                res.redirect('/login');
                const email = new Email();
                return email.render('reset-password', {
                    baseUrl: BASE_URL,
                    token: token,
                    username: username
                });

            })
            .then(renderedEmail => {
                console.log(renderedEmail)
                return transporter.sendMail({
                     to: req.body.email,
                     from: 'viarengoveronica@gmail.com',
                     subject: 'Octoshop - Password reset',
                     html: renderedEmail
                 })
            })
            .catch(error => {
                console.log(error)
            })
    })
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            console.log(user)
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }
            bcryptjs.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedin = true;
                        req.session.user = user;
                        return req.session.save(error => {
                            res.redirect('/');
                        });
                    }
                    res.redirect('/login');
                })
        })
        .catch(error => {
            console.log(error);
        })
};


exports.postSignup = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email address already exists');
                return res.redirect('/signup');
            }
            return bcryptjs.hash(password, 12)
                .then(hashPsw => {
                    const user = new User({
                        username: username,
                        email: email,
                        password: hashPsw,
                        cart: {
                            items: [],
                            totalPrice: 0
                        }
                    });
                    return user.save();
                })
                .then(user => {
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'veronicaviarengo@gmail.com',
                        subject: 'Octoshop - signup succeded',
                        html: '<h1>Octoshop - signup succeded</h1>'
                    });
                })
        })
        .catch(error => {
            console.log(error)
        })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((error) => {
        console.log(error);
        res.redirect('/');
    })
        .catch(error => { console.log(error) });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    if (!token) {
        return res.redirect('/login');
    }
    console.log(token)
    User.findOne({ resetToken: token, resetTokenExp: { $gt: Date.now() } })
        .then((user) => {
            console.log(user)
            if (!user) {
                return res.redirect('/login');
            }
            res.render("shop/new-password", {
                docTitle: "New password",
                path: "/reset-password",
                token: token,
                userId: user._id.toString()
            });

        })
        .catch((error) => {
            console.log(error);
        })
}

exports.postNewPassword = (req, res, next) => {
    const token = req.body.token;
    const newPassword = req.body.newPassword;
    const userId = req.body.userId;
    let resetUser;
    User.findOne(
        {
            resetToken: token,
            resetTokenExp: { $gt: Date.now() },
            _id: mongoose.Types.ObjectId(userId)
        })
        .then((user) => {
            console.log(mongoose.Types.ObjectId(userId))
            resetUser = user;
            console.log('user', user)
            return bcryptjs.hash(newPassword, 12);
        })
        .then((hashedPsw) => {
            console.log('resetUser', resetUser)
            resetUser.password = hashedPsw;
            resetUser.resetToken = null;
            resetUser.resetTokenExp = undefined;
            return resetUser.save();
        })
        .then((result) => {
            //TODO 
            //inviare mail che conferma che è stata cambiata la password e eventualmente un flash message
            console.log(result)
            res.redirect('/login');
        })
        .catch((error) => {
            console.log('Error: ' + error);
        })
};