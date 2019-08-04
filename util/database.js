const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoConnect = (callback) =>{
    MongoClient.connect('mongodb+srv://octoshopDbAdmin:ys09DstbyqSUU6jV@octoshopcluster-d3kt9.mongodb.net/test?retryWrites=true&w=majority')
        .then(result =>{
            console.log('Connected to MONGODB');
            callback(result);
        })
        .catch(error =>{
            console.log(error);
        })
}

module.exports = mongoConnect;