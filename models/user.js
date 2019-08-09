const mongodb = require('mongodb');
const getDb = require('./../util/database').getDb;

module.exports = class User {
    constructor( username, email) {
        this.username = username;
        this.email = email;
    }
    save(){
        const db = getDb();
        return db.collection('users').insertOne(this)
            .then(result => {
                return result;
            })
            .catch(error => console.log(error))
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').find({
            _id: new mongodb.ObjectId(userId)
        }).next()
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(error => console.log(error))
    }
}