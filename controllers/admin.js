const Product = require('./../models/product');

exports.getAddProduct = (req, res, next)=>{
    //res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render("admin/add-product", {
        docTitle:"Add Product",
        path:"/admin/add-product"
    });
}

exports.getProducts = (req, res, next)=>{
    res.render("admin/products", {
        docTitle:"Products",
        path:"/admin/products"
    });
}

exports.postAddProduct = (req, res, next)=>{
    const newProduct = new Product(req.body.title, req.body.imageUrl, req.body.description, req.body.category, req.body.price);
    newProduct.save();
    res.redirect('/');
}
