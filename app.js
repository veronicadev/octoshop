const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors')

const mongoConnect = require('./util/database').mongoConnect;
const user = require('./models/user');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    user.findById('5d4d85171c9d4400004028af')
        .then((user)=>{
            req.user = user;
            next();
        })
})

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(errorsController.get404);

mongoConnect(()=>{
    app.listen(port, ()=>{
        console.log("Server listening on port 3000")
    });
})

