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
        title: "Add product",
    });
}

exports.getProducts = (req, res, next)=>{
    Product.find()
    .then(prods => {
        res.render("admin/products", {
            prods: prods,
            docTitle: "Home",
            path: "/admin/products",
        });
    });
}

exports.postAddProduct = (req, res, next)=>{
    const newProduct = new Product({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        category: req.body.category,
        userId: req.user._id
    });
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
            title:"Update product",
        });
    });
}

exports.postEditProduct = (req, res, next)=>{
    const productId =req.body.productId;
    Product.findByID(productId)
    .then(product =>{
        if(!product){ return res.redirect('/admin/products');}
        product.title =req.body.title;
        product.imageUrl =req.body.imageUrl;
        product.description =req.body.description;
        product.category =req.body.category;
        product.price =req.body.price;
        product.save()

    })
    .then(result =>{
        res.redirect('/admin/products');
    })
    .catch(error =>{
        console.log(error)
    });
}

exports.postDeleteProduct = (req, res, next)=>{
    const productId =req.body.productId;
    Product.findByIdAndRemove(productId)
    .then(result =>{
        res.redirect('/admin/products');
    })
    .catch(error =>{
        console.log(error)
    });
}