const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        totalPrice: {
            type: Number,
            required: true
        }
    }
});

userSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp=>{
        return cp.product.toString()===product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if(cartProductIndex>=0){
        newQuantity= +this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }else{
        updatedCartItems.push({
            product:product._id,
            quantity:newQuantity
        });
    }
    let totalPrice=0;
    console.log("TOTAL PRICE: ", t);
    const updatedCart = {items: updatedCartItems, totalPrice:totalPrice};
    this.cart = updatedCart;
    return this.save()
}

userSchema.methods.removeFromCart = function(id){
    const updatedCartItems = this.cart.items.filter(item=>{
        return id.toString()!==item._id.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}


userSchema.methods.clearCart = function(id){
    this.cart.items = [];
    this.cart.totalPrice = 0;
    return this.save();
}

module.exports = mongoose.model('User', userSchema);



/*const mongodb = require('mongodb');
const getDb = require('./../util/database').getDb;

module.exports = class User {
    constructor( username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = new mongodb.ObjectId(id);
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

    addToCart(product){
        const cartProductIndex = this.cart.items.findIndex(cp=>{
            return cp._id.toString()===product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if(cartProductIndex>=0){
            newQuantity= +this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        }else{
            updatedCartItems.push({
                _id:new mongodb.ObjectId(product._id),
                quantity:newQuantity
            });
        }
        const updatedCart = {items: updatedCartItems};
        const db = getDb();
        return db.collection('users').updateOne({
            _id: new mongodb.ObjectId(this._id)
        },
        {
            $set: {cart: updatedCart}
        })
        .then(result => {
            return result;
        })
        .catch(error => console.log(error))
    }

    getCart(){
        const db = getDb();
        const productIds = this.cart.items.map(item=>{
            return item._id;
        })
        return db.collection('products').find({
            _id:{
                $in: productIds
            }
        }).toArray()
        .then(products => {
            const prods = products.map(item =>{
                return {...item, quantity: this.cart.items.find(prod =>{
                    return prod._id.toString() === item._id.toString();
                }).quantity};
            });
            let totalPrice = 0;
            prods.forEach(item => {
                totalPrice = totalPrice + item.price * item.quantity;
            });
            console.log('ao',totalPrice)
            const newCart = {
                items: prods,
                totalPrice: totalPrice
            }
            return newCart;
        })
        .catch(error => console.log(error))
    }

    addOrder(){
        const db = getDb();
        return this.getCart()
            .then(cart=>{
                const order = {
                    items: cart.items,
                    totalPrice: cart.totalPrice,
                    user: {
                        _id:new mongodb.ObjectId(this._id)
                    }
                };
                return db.collection('orders').insertOne(order);
            })
            .then(result =>{
                this.cart = {
                    items: []
                };
                return db.collection('users').updateOne({
                    _id: new mongodb.ObjectId(this._id)
                },
                {
                    $set: {cart: { items:[]}}
                })

            })
    }

    deleteItemFromCart(id){
        const updatedCartItems = this.cart.items.filter(item=>{
            return id.toString()!==item._id.toString();
        });
        const db = getDb();
        return db.collection('users').updateOne({
            _id: new mongodb.ObjectId(this._id)
        },
        {
            $set: {cart: {items:updatedCartItems}}
        })
        .then(result => {
            return result;
        })
        .catch(error => console.log(error))
    }

    getOrders(){
        const db = getDb();
        return db.collection('orders').find({
            "user._id":new mongodb.ObjectId(this._id)
        }).toArray()
        .then(orders =>{
            return orders;
        })
        .catch(error => console.log(error))
    }
}*/