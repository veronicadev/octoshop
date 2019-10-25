const roles = require('./../util/roles').roles;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    name:{
        type: String  
    },
    surname:{
        type: String
    },
    companyName:{
        type: String
    },
    country:{
        type: String
    },
    streetAddress:{
        type: String
    },
    city:{
        type: String
    },
    province:{
        type: String
    },
    phone:{
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExp: Date,
    activeToken: String,
    active: Boolean,
    roleType: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
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
        }]
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
    const updatedCart = {items: updatedCartItems};
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

