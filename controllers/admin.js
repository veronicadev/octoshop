const Product = require('./../models/product');

exports.getAddProduct = (req, res, next)=>{
    //res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render("admin/edit-product", {
        docTitle:"Add Product",
        path:"/admin/add-product",
        editing:false,
        formAction:'/admin/add-product',
        title: "Add product"
    });
}

exports.getProducts = (req, res, next)=>{
    Product.all((prods) => {
        res.render("admin/products", {
            prods: prods,
            docTitle: "Home",
            path: "/admin/products"
        });
    });
}

exports.postAddProduct = (req, res, next)=>{
    const newProduct = new Product(req.body.title, req.body.imageUrl, req.body.description, req.body.category, req.body.price);
    newProduct.save();
    res.redirect('/');
}

exports.getEditProduct = (req, res, next)=>{
    const editMode = req.query.edit;
    if(!editMode){ res.redirect('/');} // redirect to admin
    const productId = req.params.productId;
    Product.findByID(productId, (product)=>{
        if(!product){ return res.redirect('/');}
        res.render("admin/edit-product", {
            docTitle:"Edit Product",
            path:"/admin/edit-product",
            editing:editMode,
            product:product,
            formAction:'/admin/edit-product/'+productId,
            title:"Update product"
        });
    })
}