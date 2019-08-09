const Product = require('./../models/product');

exports.getAddProduct = (req, res, next)=>{
    //res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    const product = {
        title:'',
        description:'',
        category:'',
        imageUrl:'',
        price:''
    }
    res.render("admin/edit-product", {
        docTitle:"Add Product",
        path:"/admin/add-product",
        editing:false,
        formAction:'/admin/add-product',
        product:product,
        title: "Add product"
    });
}

exports.getProducts = (req, res, next)=>{
    Product.all()
    .then(prods => {
        res.render("admin/products", {
            prods: prods,
            docTitle: "Home",
            path: "/admin/products"
        });
    });
}

exports.postAddProduct = (req, res, next)=>{
    const newProduct = new Product(req.body.title, req.body.imageUrl, req.body.description, req.body.category, req.body.price);
    newProduct.save()
    .then(prod =>{
        console.log('Product created!' , prod);
        res.redirect('/admin/products');
    })
    .catch(error =>{
        console.log('Product not created!',error);
        res.redirect('/admin/products');
    });
}

exports.getEditProduct = (req, res, next)=>{
    const editMode = req.query.edit;
    if(!editMode){ res.redirect('/admin/products');} // redirect to admin
    const productId = req.params.productId;
    Product.findByID(productId)
    .then(product =>{
        if(!product){ return res.redirect('/admin/products');}
        res.render("admin/edit-product", {
            docTitle:"Edit Product",
            path:"/admin/edit-product",
            editing:editMode,
            product:product,
            formAction:'/admin/edit-product',
            title:"Update product"
        });
    });
}

exports.postEditProduct = (req, res, next)=>{
    const productId =req.body.productId;
    const updatedProduct = new Product(req.body.title, req.body.imageUrl, req.body.description, req.body.category, req.body.price, productId);
    updatedProduct.save()
    .then(result =>{
        res.redirect('/admin/products');
    })
    .catch(error =>{
        console.log(error)
    });
}

exports.postDeleteProduct = (req, res, next)=>{
    const productId =req.body.productId;
    Product.deleteByID(productId)
    .then(result =>{
        res.redirect('/admin/products');
    })
    .catch(error =>{
        console.log(error)
    });
}