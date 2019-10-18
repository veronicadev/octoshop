const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const port = process.env.PORT || 3000;
const Role = require('./models/role');
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_KEY = process.env.SESSION_KEY;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const customerRoutes = require("./routes/customer");
const errorsController = require('./controllers/errors')

const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));

/*SESSION*/
app.use(session({
    secret:SESSION_KEY,
    resave: false,
    saveUninitialized:false,
    store: store
}));
app.use(csrfProtection);

/*SESSION USER*/
app.use((req, res, next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(!user) return next();
            return user
                .populate('roleType')
                .execPopulate()
        })
        .then(user=>{
            req.user = user;
            res.locals.user = user;
            next();
        })
        .catch(error => {
            throw new Error(error);
        })
});

/*USER ROLES*/
/*
app.use((req, res, next)=>{
    if(!req.userRoles){
       Role.find()
            .then(roles =>{
                req.userRoles = roles;
                console.log(req.userRoles);
            })
            .catch(error =>{
                console.log(error);
            })
    }
    next();
});*/

/*CART ITEMS*/
app.use((req, res, next)=>{
    let cartItemsNum = 0;
    res.locals.isAuth = req.session.isLoggedin;
    res.locals.csrfToken = req.csrfToken();
    if(req.user){
        cartItemsNum = req.user.cart.items.length;
    }
    res.locals.cartItemsNum = cartItemsNum;
    next();
});

/*FLASH MESSAGES*/
app.use(flash());

/*ROUTING*/
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/customer', customerRoutes);

app.get('/500', errorsController.get500);
app.use(errorsController.get404);

/**ERROR HANDLING MIDDLEWARE */
app.use((error, req, res, next)=>{
    res.redirect('/500');
})
/*CONNECTION DB & SERVER START*/
mongoose.connect(MONGODB_URI,{useNewUrlParser: true})
    .then(result=>{
        console.log('Mongoose started');
        app.listen(port, ()=>{
            console.log("Server listening on port 3000")
        });
    })
    .catch(error=> {
        console.error('Mongoose connection failed', error);
    })