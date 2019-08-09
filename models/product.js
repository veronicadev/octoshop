const mongodb = require('mongodb');
const getDb = require('./../util/database').getDb;

module.exports = class Product {
    constructor( title, imageUrl, description, category, price, id) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description= description;
        this.category = category;
        this.price = price; 
        this._id= id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        let dbOp;
        if(this._id){
            dbOp = db.collection('products').updateOne({
                _id: this._id
            }, 
            {
                $set: this
            })
        }else{
            dbOp= db.collection('products').insertOne(this) 
        }
        return dbOp
            .then(result => {console.log(result)})
            .catch(error => console.log(error))
    }

    static all(cb) {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(result => {
                console.log(result);
                return result;
            })
            .catch(error => console.log(error))
    }

    static lastNProducts(limit){
        const db = getDb();
        return db.collection('products').find().limit(limit).toArray()
            .then(result => {
                console.log(result);
                return result;
            })
            .catch(error => console.log(error))
    }

    static findByID(id){
        const db = getDb();
        return db.collection('products').find({
            _id: new mongodb.ObjectId(id)
        }).next()
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(error => console.log(error))
    }

    static deleteByID(id){
        const db = getDb();
        return db.collection('products').deleteOne({
            _id: new mongodb.ObjectId(id)
        })
        .catch(error => console.log(error))
    }
}