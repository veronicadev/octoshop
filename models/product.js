const fs = require("fs");
const path = require("path");
const rootDir = require('./../util/path')

const p = path.join(rootDir, 'data', 'products.json');
const getProductsFromFile = (cb)=>{
    return fs.readFile(p, (error, data)=>{
        if(error){
            return cb([]);
        }
        cb(JSON.parse(data));
    });
}


module.exports = class Product {
    constructor(title, imageUrl, description, category, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description= description;
        this.category = category;
        this.price = price;
    }

    save() {
        getProductsFromFile((products)=>{
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (error)=>{
                console.log(error)
            });
        })
    }

    static all(cb) {
        getProductsFromFile(cb)
    }
}