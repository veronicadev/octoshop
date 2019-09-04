const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

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
    let message = req.flash('error');
    if(message.length>0){
        message= message[0];
    }else{
        message = null;
    }
    res.render("shop/login", {
        docTitle: "Login",
        errorMessage: message,
        path: "/login"
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0){
        message= message[0];
    }else{
        message = null;
    }
    res.render("shop/reset", {
        docTitle: "Reset password",
        errorMessage: message,
        path: "/reset"
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (error, buffer)=>{
        if(error){
            console.log(error);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user=>{
                if(!user){
                    req.flash('error', 'No user with that mail found.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExp = Date.now() + 3600000;
                user.save();
            })
            .then((result)=>{
                res.redirect('/login');
                return transporter.sendMail({
                    to:req.body.email,
                    from: 'info@octoshop.com',
                    subject: 'Octoshop - password reset',
                    html: `
                    <h1>
                        You requested a password reset. Click the link below to set a new password
                    </h1>
                    <a href="${req.baseUrl}/reset-password/${token}">Reset password</a>`
                });
            })
            .catch(error=>{
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

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    console.log(token)
    User.findOne({resetToken: token, resetTokenExp: {$gt: Date.now()}})
    .then((user)=>{
        console.log(user)
        if(!user){
            return res.redirect('/login');
        }
        res.render("shop/new-password", {
            docTitle: "New password",
            path: "/reset-password",
            userId: user._id.toString()
        });

    })
    .catch((error)=>{
        console.log(error);
    })
}