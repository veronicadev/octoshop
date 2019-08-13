const User = require('./../models/user');
exports.getLogin = (req, res, next) => {
    console.log(req.get('Cookie'));
    res.render("shop/login", {
        docTitle: "Login",
        path: "/login"
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('5d516139fb556fad9fe0b359')
    .then(user => {
        req.session.isLoggedin = true;
        req.session.user = user;
            res.session.save(()=>{
                res.redirect('/');
            });
        })
        .catch(error => {
            console.log(error);
        })
};


exports.postLogout = (req, res, next) => {
    req.session.destroy((error)=>{
        console.log(error);
        res.redirect('/');
    })
    .catch(error=>{console.log(error)});
};
