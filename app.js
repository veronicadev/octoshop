const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors')


app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(errorsController.get404);


mongoose.connect('mongodb+srv://octoshopDbAdmin:ys09DstbyqSUU6jV@octoshopcluster-d3kt9.mongodb.net/octoshop?retryWrites=true&w=majority',{useNewUrlParser: true})
    .then(result=>{
        console.log('Mongoose started')
        app.listen(port, ()=>{
            console.log("Server listening on port 3000")
        });
    })
    .catch(error=> {
        console.error('Mongoose connection failed', error);
    })