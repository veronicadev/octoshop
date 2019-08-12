const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors')

const User = require('./models/user');


app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findById('5d516139fb556fad9fe0b359')
        .then(user=>{
            req.user = user;
            console.log(user);
            next();
        })
        .catch(error=>{
            console.log(error);
        })
})

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(errorsController.get404);


mongoose.connect('mongodb+srv://octoshopDbAdmin:ys09DstbyqSUU6jV@octoshopcluster-d3kt9.mongodb.net/octoshop?retryWrites=true&w=majority',{useNewUrlParser: true})
    .then(result=>{
        console.log('Mongoose started');
       /* const user = new User({
            username:'admin',
            email:'info@octoshop.com',
            cart:{
                items:[],
                totalPrice:0
            }
        });
        user.save();*/
        app.listen(port, ()=>{
            console.log("Server listening on port 3000")
        });
    })
    .catch(error=> {
        console.error('Mongoose connection failed', error);
    })