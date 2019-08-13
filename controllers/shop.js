const Product = require('./../models/product');
const Order = require('./../models/order');
const User = require('./../models/user');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(prods => {
            console.log(prods)
            res.render("shop/products", {
                prods: prods,
                docTitle: "Shop",
                path: "/products",
                isAuth: req.session.isLoggedin
            });
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render("shop/product-details", {
                product: product,
                docTitle: "Shop - " + product.title,
                path: "/products",
                isAuth: req.session.isLoggedin
            });
        });
}

exports.getIndex = (req, res, next) => {
    Product.find().limit(6)
        .then(prods => {
            res.render("shop/index", {
                prods: prods,
                docTitle: "Octoshop - Homepage ",
                path: "/",
                isAuth: req.session.isLoggedin
            });
        });
}

exports.getCart = (req, res, next) => {
    req.session.user.populate('cart.items.product')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            const totalPrice = user.cart.totalPrice;
            console.log(products)
            res.render("shop/cart", {
                docTitle: "Cart",
                path: "/cart",
                totalPrice: totalPrice,
                products: products,
                isAuth: req.session.isLoggedin
            });
        });
}


exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        docTitle: "Checkout",
        path: "/checkout",
        isAuth: req.session.isLoggedin
    });
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.session.user.removeFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        })
};

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.product')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(item => {
                return { quantity: item.quantity, product: { ...item.product._doc } }
            });
            const newOrder = new Order({
                user: req.user._id,
                products: products,
                totalPrice: user.cart.totalPrice
            });
            console.log(newOrder)
            return newOrder.save();
        })
        .then(result => {
            req.user.clearCart();
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(error => {
            console.log(error)
        })
};

exports.getOrders = (req, res, next) => {
    Order.find({ user: req.session.user._id })
        .then(orders => {
            res.render("customer/orders", {
                docTitle: "Orders",
                path: "/orders",
                orders: orders,
                user: req.session.user,
                isAuth: req.session.isLoggedin
            });

        })
};