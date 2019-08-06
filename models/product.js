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
        
    }

    static findByID(id, cb){
       
    }

    static deleteByID(id){

    }
}