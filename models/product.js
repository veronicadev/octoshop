const fs = require("fs");
const path = require("path");
const rootDir = require('./../util/path')
const Cart = require('./cart');

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
    constructor(productId, title, imageUrl, description, category, price) {
        this.productId = productId;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description= description;
        this.category = category;
        this.price = price;
    }

    save() {
        getProductsFromFile((products)=>{
            if(this.productId){
                const existingProductIndex = products.findIndex(prod => this.productId===prod.productId)
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (error)=>{
                    console.log(error)
                });
            }else{
                this.productId = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (error)=>{
                    console.log(error)
                });
            }
            
        })
    }

    static all(cb) {
        getProductsFromFile(cb)
    }

    static findByID(id, cb){
        getProductsFromFile(products =>{
            const product = products.find((p)=>{
                return (p.productId === id)
            })
            cb(product);
        })
    }

    static deleteByID(id){
        getProductsFromFile(products =>{
            const product = products.find(prod => prod.productId===id);
            console.log(product)
            const updatedProducts = products.filter((p)=>{
                return (p.productId !== id)
            })
            fs.writeFile(p, JSON.stringify(updatedProducts), (error)=>{
                if(!error){
                    Cart.deleteProduct(id, product.price)
                }
                console.log(error)
            });
        })
    }
}