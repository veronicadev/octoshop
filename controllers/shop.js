const Product = require('./../models/product');

exports.getProducts = (req, res, next) => {
    Product.all((prods) => {
        res.render("shop/products", {
            prods: prods,
            docTitle: "Shop",
            path: "/products"
        });
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByID(prodId, (product)=>{
        console.log(product);
        res.render("shop/product-details", {
            product:product,
            docTitle: "Shop - " + product.title,
            path: "/products"
        });
    })
}

exports.getIndex = (req, res, next) => {
    Product.all((prods) => {
        res.render("shop/index", {
            prods: prods,
            docTitle: "Octoshop - Homepage ",
            path: "/"
        });
    });
}

exports.getCart = (req, res, next) => {
    res.render("shop/cart", {
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

