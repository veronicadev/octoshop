const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    products: [{
        product: {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
    }],
    totalPrice: {
        type: Number,
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);