const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}));

exports.getSignup = (req, res, next) => {
    res.render("shop/signup", {
        docTitle: "Signup",
        path: "/signup"
    });
};

exports.getLogin = (req, res, next) => {
    res.render("shop/login", {
        docTitle: "Login",
        path: "/login"
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            console.log(user)
            if (!user) {
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
                        to:email,
                        from: 'info@octoshop.com',
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
