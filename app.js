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
const multer = require('multer');
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_KEY = process.env.SESSION_KEY;
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');

const roles = require('./util/roles').roles;

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

/**REQUEST LOGGING*/
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
});
app.use(morgan('combined', { stream: accessLogStream }));


const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        const currentDate = new Date().toISOString().replace(/:/g, "-");
        cb(null, currentDate + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const multerObj = {
    storage: fileStorage,
    fileFilter: fileFilter
};


app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer(multerObj).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

/*SESSION*/
app.use(session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrfProtection);

/*SESSION USER*/
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    req.isAdmin = false;
    res.locals.isAdmin = false;
    User.findById(req.session.user._id)
        .populate('roleType')
        .exec()
        .then(user => {
            if (!user) return next();
            req.user = user;
            res.locals.user = user;

            if (user.roleType.name===roles.ADMIN){
                req.isAdmin = true;
                res.locals.isAdmin = true;
            }
            next();
        })
        .catch(error => {
            throw new Error(error);
        })
});


/*CART ITEMS*/
app.use((req, res, next) => {
    let cartItemsNum = 0;
    res.locals.isAuth = req.session.isLoggedin;
    res.locals.csrfToken = req.csrfToken();
    if (req.user) {
        cartItemsNum = req.user.cart.items.length;
    }
    res.locals.cartItemsNum = cartItemsNum;
    next();
});

/*FLASH MESSAGES*/
app.use(flash());

/*ROUTING*/
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/customer', customerRoutes);

app.get('/500', errorsController.get500);
app.use(errorsController.get404);

/**ERROR HANDLING MIDDLEWARE */
app.use((error, req, res, next) => {
    console.log(error)
    if (!error.httpStatusCode) error.httpStatusCode = 500;
    res.redirect('/' + error.httpStatusCode);
})
/*HELMET*/
app.use(helmet());

/**COMPRESSION*/
app.use(compression());



/*CONNECTION DB & SERVER START*/
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(port, () => {
            console.log("Server listening on port 3000")
            Role.find()
                .then(roles => {
                    global.roles = roles;
                })
        });
    })
    .catch(error => {
        next(error);
        //console.error(error);
    })