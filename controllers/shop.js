const Product = require('./../models/product');

exports.getProducts = (req, res, next) => {
    Product.all((prods) => {
        res.render("shop/products", {
            prods: prods,
            docTitle: "Homepage",
            path: "/products"
        });
    });
}

exports.getIndex = (req, res, next) => {
    Product.all((prods) => {
        res.render("shop/index", {
            prods: prods,
            docTitle: "Shop",
            path: "/"
        });
    });
}

exports.getCart = (req, res, next) => {
    res.render("shop/index", {
        docTitle: "Cart",
        path: "/cart"
    });
}


exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        docTitle: "Checkout",
        path: "/checkout"
    });
}

