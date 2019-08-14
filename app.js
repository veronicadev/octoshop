const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const port = process.env.PORT || 3000;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorsController = require('./controllers/errors')

const User = require('./models/user');

const app = express();
const MONGODB_URI = 'mongodb+srv://octoshopDbAdmin:ys09DstbyqSUU6jV@octoshopcluster-d3kt9.mongodb.net/octoshop';
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

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
})

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