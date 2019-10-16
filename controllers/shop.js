const Product = require('./../models/product');
const Category = require('./../models/category');
const Order = require('./../models/order');
const User = require('./../models/user');
const utils = require('./../util/utils');

exports.getProducts = (req, res, next) => {
    Promise.all([
            Product.find(),
            Category.find()
        ])
        .then(([prods, categories]) => {
            console.log(prods)
            res.render("shop/products", {
                prods: prods,
                categories: categories,
                docTitle: "Shop",
                path: "/products"
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
                path: "/products"
            });
        });
}

exports.getIndex = (req, res, next) => {
    Product.find().limit(6)
        .then(prods => {
            res.render("shop/index", {
                prods: prods,
                docTitle: "Octoshop - Homepage ",
                path: "/"
            });
        });
}

exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.product')
        .execPopulate()
        .then(user => {
            let totalPrice = 0;
            const products = user.cart.items;
            products.forEach((item, index) => {
                totalPrice = totalPrice + (item.product.price * item.quantity);
            });
            const infoMessage = utils.getFlashMessage(req, 'info');
            const errorMessage = utils.getFlashMessage(req, 'error');
            res.render("shop/cart", {
                docTitle: "Cart",
                path: "/cart",
                totalPrice: totalPrice,
                products: products,
                infoMessage: infoMessage,
                errorMessage: errorMessage
            });
        });
}


exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        docTitle: "Checkout",
        path: "/checkout"
    });
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            req.flash('info', 'Product "'+product.title+'" added!');
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
    req.user.removeFromCart(productId)
        .then(result => {
            req.flash('info', 'Product removed');
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
            let totalPrice = 0;
            const products = user.cart.items.map(item => {
                return { quantity: item.quantity, product: {...item.product._doc } }
            });
            products.forEach((item, index) => {
                totalPrice = totalPrice + (item.product.price * item.quantity);
            });
            const newOrder = new Order({
                user: req.user._id,
                products: products,
                totalPrice: totalPrice
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

exports.getCategory = (req, res, next) => {
    const catId = req.params.catId;
    if (!catId) res.redirect('/products');
    Promise.all([
            Category.find({ _id: catId }),
            Product.find(),
            Category.find()
        ])
        .then(([category, prods, categories]) => {
            console.log(category)
            res.render("shop/category", {
                docTitle: "Category -" + category[0].name,
                path: "/categories",
                categories: categories,
                category: category[0],
                prods: prods
            });
        })
        .catch(error => {
            console.log(error)
        })
}