const mongodb = require('mongodb');
const MongoClient = new mongodb.MongoClient('mongodb+srv://octoshopDbAdmin:ys09DstbyqSUU6jV@octoshopcluster-d3kt9.mongodb.net/octoshop?retryWrites=true&w=majority', { useNewUrlParser: true });
let _db; 
const mongoConnect = (callback) =>{
    MongoClient.connect()
        .then(client =>{
            console.log('Connected to MONGODB');
            _db = client.db();
            callback(client);
        })
        .catch(error =>{
            console.log('Not connected',error);
        })

}

const getDb = () =>{
    if(_db){
        return _db
    }
    throw 'No database found!';
}

    
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;