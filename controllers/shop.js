const Product = require('./../models/product');
const Category = require('./../models/category');
const Order = require('./../models/order');
const User = require('./../models/user');
const utils = require('./../util/utils');
const mongoose = require('mongoose');
const ITEMS_PER_PAGE = 2;
exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems = 0;
    Product.find().countDocuments()
        .then(count=>{
            totalItems = count;
            return Promise.all([
                    Product.find()
                        .skip((page-1) * ITEMS_PER_PAGE)
                        .limit(ITEMS_PER_PAGE),
                    Category.find()
                ])
        })
        .then(([prods, categories]) => {
            console.log(prods)
            res.render("shop/products", {
                prods: prods,
                categories: categories,
                docTitle: "Shop",
                path: "/products",
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil((totalItems / ITEMS_PER_PAGE))
            });
        })
        .catch(err=>{
            return next(err);
        })
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .populate('category')
        .exec()
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
    req.user.populate('cart.items.product')
        .execPopulate()
        .then(user => {
            let totalPrice = 0;
            const products = user.cart.items;
            if(products.length===0) return res.redirect('/cart');
            products.forEach((item, index) => {
                totalPrice = totalPrice + (item.product.price * item.quantity);
            });
            const infoMessage = utils.getFlashMessage(req, 'info');
            const errorMessage = utils.getFlashMessage(req, 'error');
            res.render("shop/checkout", {
                docTitle: "Checkout",
                path: "/checkout",
                totalPrice: totalPrice,
                products: products,
                infoMessage: infoMessage,
                errorMessage: errorMessage
            });
        });
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            req.flash('info', 'Product "' + product.title + '" added!');
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
            res.redirect('/customer/orders');
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