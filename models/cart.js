const fs = require('fs');
const rootDir = require('./../util/path');
const path = require('path');
const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    /*constructor(){
        this.products = [];
        this.totalPrice = 0;
    }*/
    static addProduct(id, productPrice){
        fs.readFile(p, (err, fileContent)=>{
            let cart = { products: [], totalPrice:0 }
            if(!err){
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(prod => prod.productId == id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty+1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }else{
                updatedProduct= {productId: id, qty:1}
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err)=>{
                console.log(err);
                console.log(cart)
            })
        })
    }
}