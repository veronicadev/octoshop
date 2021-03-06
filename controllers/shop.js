const Product = require('./../models/product');
const Category = require('./../models/category');
const Order = require('./../models/order');
const User = require('./../models/user');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator/check');
const utils = require('./../util/utils');
const STRIPE_KEY = process.env.STRIPE_KEY;
const STRIPE_KEY_SECRET = process.env.STRIPE_KEY_SECRET;
const stripe = require('stripe')(STRIPE_KEY_SECRET);
const ITEMS_PER_PAGE = 2;
exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems = 0;
    Product.find().countDocuments()
        .then(count => {
            totalItems = count;
            return Promise.all([
                Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
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
        .catch(err => {
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
            if (products.length === 0) return res.redirect('/cart');
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
                errorMessage: errorMessage,
                tempUser: req.user
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
    const errorsVal = validationResult(req);
    const stripeToken = req.body.stripeToken;
    const data = {
        name: req.body.name,
        surname: req.body.surname,
        company: req.body.company,
        country: req.body.country,
        streetAddress: req.body.streetAddress,
        postcode: req.body.postcode,
        city: req.body.city,
        province: req.body.province,
        phone: req.body.phone,
        notes: req.body.notes
    };
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
            if (!errorsVal.isEmpty()) {
                return res.status(422).render("shop/checkout", {
                    docTitle: "Checkout",
                    path: "/checkout",
                    errorMessage: utils.getValidationMessage(errorsVal),
                    validationErrors: errorsVal.array(),
                    infoMessage: null,
                    totalPrice: totalPrice,
                    products: products,
                    tempUser: data
                });
            }
            const newOrder = new Order({
                user: req.user._id,
                products: products,
                totalPrice: totalPrice,
                name: req.body.name,
                surname: req.body.surname,
                company: req.body.company,
                country: req.body.country,
                streetAddress: req.body.streetAddress,
                postcode: req.body.postcode,
                city: req.body.city,
                province: req.body.province,
                phone: req.body.phone,
                notes: req.body.notes
            });
            
            let orderFetched;
            return newOrder.save()
                .then(order => {
                    orderFetched = order;
                    return stripe.customers.create({
                        source: req.body.stripeToken,
                        email:req.user.email,
                        name: req.body.name + ' ' + req.body.surname + ' ' + req.body.company,
                        address: {
                            line1:req.body.streetAddress,
                            city: req.body.city + ' ' + req.body.province,
                            country:req.body.country,
                            postal_code:req.body.postcode
                        },
                        phone: req.body.phone
                      })
                })
                .then(customer=>{
                    return stripe.charges.create({
                        amount: totalPrice * 100,
                        currency: 'usd',
                        description: req.user.name + ' order',
                        metadata: {
                            order_id: orderFetched._id.toString()
                        },
                        receipt_email:customer.email,
                        customer: customer.id
                    })
                })
                .then(result => {
                    return req.user.clearCart();
                })
                .then(response=>{
                    res.redirect('/customer/orders');
                })
        })
        .catch(error => {
             return next(error)
        })
};

exports.getCategory = (req, res, next) => {
    const catId = req.params.catId;
    if (!catId) res.redirect('/products');
    Promise.all([
            Category.findOne({ _id: catId }),
            Product.find({category:catId}),
            Category.find()
        ])
        .then(([category, prods, categories]) => {
            res.render("shop/category", {
                docTitle: "Category -" + category.name,
                path: "/categories",
                categories: categories,
                category: category,
                prods: prods
            });
        })
        .catch(error => {
            return next(error)
        })
}