const Product = require('./../models/product');
const Cart = require('./../models/cart');
const User = require('./../models/user');

exports.getProducts = (req, res, next) => {
    Product.find()
    .then(prods =>{
        console.log(prods)
        res.render("shop/products", {
            prods: prods,
            docTitle: "Shop",
            path: "/products"
        });
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product =>{
        res.render("shop/product-details", {
            product:product,
            docTitle: "Shop - " + product.title,
            path: "/products"
        });
    });
}

exports.getIndex = (req, res, next) => {
    Product.find().limit(6)
        .then(prods =>{
            res.render("shop/index", {
                prods: prods,
                docTitle: "Octoshop - Homepage ",
                path: "/"
            });
        });
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then(cart=>{
        const totalPrice = cart.totalPrice;
        const products = cart.items;
        res.render("shop/cart", {
            docTitle: "Cart",
            path: "/cart",
            totalPrice: totalPrice,
            products: products
        });
    });
}


exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        docTitle: "Checkout",
        path: "/checkout"
    });
}

exports.postCart = (req, res, next) =>{
    const productId=req.body.productId;
    Product.findByID(productId)
    .then(product =>{
        return req.user.addToCart(product);
    })
    .then((result)=>{
        res.redirect('/cart');
    })
    .catch(error=>{
        console.log(error);
    })
}

exports.postCartDeleteProduct = (req, res, next) =>{
    const productId = req.body.productId;
    req.user.deleteItemFromCart(productId)
        .then(result=>{
            res.redirect('/cart');
        })
        .catch(error=>{
            console.log(error);
        })
}

exports.postOrder = ((req, res, next) => {
    let prods, fetchedCart;
    req.user.addOrder()
        .then(result=>{
            res.redirect('/orders');
        })
});

exports.getOrders = ((req, res, next) => {
    console.log('user ', req.user)
    req.user.getOrders()
        .then(orders =>{
            res.render("customer/orders", {
                docTitle: "Orders",
                path: "/orders",
                orders: orders,
                user: req.user
            });

        })
});
