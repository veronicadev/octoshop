const getDb = require('./../util/database').getDb;

module.exports = class Product {
    constructor( title, imageUrl, description, category, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description= description;
        this.category = category;
        this.price = price;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this)
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

    static findByID(id, cb){
       
    }

    static deleteByID(id){

    }
}