const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const port = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
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
app.use(session({
    secret:'secretKey',
    resave: false,
    saveUninitialized:false,
    store: store
}));
app.use(csrfProtection);
app.use((req, res, next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(error => {
        console.log(error);
    })
});
app.use((req, res, next)=>{
    res.locals.isAuth = req.session.isLoggedin;
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use(flash());

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404);


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