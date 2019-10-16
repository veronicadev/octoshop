const Product = require('./../models/product');
const Category = require('./../models/category');

const { validationResult } = require('express-validator/check');
const utils = require('./../util/utils');

exports.getAddProduct = (req, res, next) => {
    //res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    const product = {
        title: '',
        description: '',
        category: '',
        imageUrl: '',
        price: ''
    }
    res.render("admin/edit-product", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        formAction: '/admin/add-product',
        product: product,
        title: "Add product",
        errorMessage: null,
        infoMessage:utils.getFlashMessage(req, 'info'),
        user: req.session.user,
        validationErrors: []
    });
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(prods => {
            res.render("admin/products", {
                prods: prods,
                docTitle: "Home",
                infoMessage:utils.getFlashMessage(req, 'info'),
                errorMessage:null,
                path: "/admin/products",
                user: req.session.user,
            });
        });
}

exports.postAddProduct = (req, res, next) => {
    const errorsVal = validationResult(req);
    if (!errorsVal.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            docTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            formAction: '/admin/add-product',
            errorMessage: utils.getValidationMessage(errorsVal),
            validationErrors: errorsVal.array(),
            infoMessage: null,
            title: "Add product",
            user: req.session.user,
            product: {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                price: req.body.price,
                category: req.body.category,
                userId: req.user._id
            }
        });
    }
    const newProduct = new Product({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        category: req.body.category,
        userId: req.user._id
    });
    newProduct.save()
        .then(prod => {
            req.flash('info', 'Product "'+req.body.title+'" created!'); 
            console.log('Product created!', prod);
        })
        .then(()=>{
            res.redirect('/admin/products'); 
        })
        .catch(error => {
            console.log('Product not created!', error);
            res.redirect('/admin/products');
        });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) { res.redirect('/admin/products'); } // redirect to admin
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) { return res.redirect('/admin/products'); }
            res.render("admin/edit-product", {
                docTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
                formAction: '/admin/edit-product',
                title: "Update product",
                infoMessage:utils.getFlashMessage(req, 'info'),
                errorMessage:null,
                validationErrors: [],
                user: req.session.user,
            });
        });
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const errorsVal = validationResult(req);
    console.log(errorsVal.errors)
    if (!errorsVal.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            docTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: true,
            formAction: '/admin/edit-product',
            errorMessage: utils.getValidationMessage(errorsVal),
            validationErrors: errorsVal.array(),
            infoMessage: null,
            title: "Edit product",
            user: req.session.user,
            product: {
                _id: productId,
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                price: req.body.price,
                category: req.body.category
            }
        });
    }
    Product.findById(productId)
        .then(product => {
            if (!product) { return res.redirect('/admin/products'); }
            product.title = req.body.title;
            product.imageUrl = req.body.imageUrl;
            product.description = req.body.description;
            product.category = req.body.category;
            product.price = req.body.price;
            product.save()

        })
        .then(prod => {
            req.flash('info', 'Product "'+req.body.title+'" updated!');
           res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error)
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndRemove(productId)
        .then(result => {
            req.flash('info', 'Product deleted!');
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error)
        });
}

exports.getAddCategory = (req, res, next) => {
    //res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    const category = {
        name: '',
        description: '',
    }
    res.render("admin/edit-category", {
        docTitle: "Add category",
        path: "/admin/add-category",
        editing: false,
        formAction: '/admin/add-category',
        category: category,
        title: "Add category",
        infoMessage:utils.getFlashMessage(req, 'info'),
        errorMessage:null,
        validationErrors: [],
        user: req.session.user,
    });
}

exports.getCategories = (req, res, next) => {
    Category.find()
        .then(cats => {
            res.render("admin/categories", {
                cats: cats,
                docTitle: "Categories",
                infoMessage:utils.getFlashMessage(req, 'info'),
                errorMessage:null,
                path: "/admin/categories",
            });
        });
}

exports.postAddCategory = (req, res, next) => {
    const errorsVal = validationResult(req);
    if (!errorsVal.isEmpty()) {
        return res.status(422).render("admin/edit-category", {
            docTitle: "Add category",
            path: "/admin/add-category",
            editing: false,
            formAction: '/admin/add-category',
            errorMessage: utils.getValidationMessage(errorsVal),
            infoMessage: null,
            validationErrors: errorsVal.array(),
            title: "Add category",
            user: req.session.user,
            category: {
                name: req.body.name,
                description: req.body.description
            }
        });
    }
    const newCategory = new Category({
        name: req.body.name,
        description: req.body.description
    });
    newCategory.save()
        .then(category => {
            req.flash('info', 'Category "'+req.body.name+'" created!');
            console.log('Category created!', category);
            res.redirect('/admin/categories');
        })
        .catch(error => {
            console.log('Category not created!', error);
            res.redirect('/admin/categories');
        });
}

exports.postDeleteCategory = (req, res, next) => {
    const catId = req.body.catId;
    Category.findByIdAndRemove(catId)
        .then(result => {
            req.flash('info', 'Category deleted!');
            res.redirect('/admin/categories');
        })
        .catch(error => {
            console.log(error);
            res.redirect('/admin/categories');
        })
}

exports.getEditCategory = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) { res.redirect('/admin/categories'); } // redirect to admin
    const catId = req.params.catId;
    Category.findById(catId)
        .then(category => {
            if (!category) { return res.redirect('/admin/categories'); }
            res.render("admin/edit-category", {
                docTitle: "Edit category",
                path: "/admin/edit-category",
                editing: editMode,
                category: category,
                formAction: '/admin/edit-category',
                title: "Update category",
                infoMessage:utils.getFlashMessage(req, 'info'),
                errorMessage: null,
                validationErrors: [],
                user: req.session.user,
            });
        });
}

exports.postEditCategory = (req, res, next) => {
    const catId = req.body.catId;
    const errorsVal = validationResult(req);
    if (!errorsVal.isEmpty()) {
        return res.status(422).render("admin/edit-category", {
            docTitle: "Edit category",
            path: "/admin/edit-category",
            editing: true,
            formAction: '/admin/edit-category',
            errorMessage: utils.getValidationMessage(errorsVal),
            validationErrors: errorsVal.array(),
            infoMessage: null,
            user: req.session.user,
            title: "Edit category",
            category: {
                _id: catId,
                name: req.body.name,
                description: req.body.description
            }
        });
    }
    Category.findById(catId)
        .then(category => {
            if (!category) { return res.redirect('/admin/categories'); }
            category.name = req.body.name;
            category.description = req.body.description;
            category.save()

        })
        .then(result => {
            req.flash('info', 'Category "'+req.body.name+'" updated!');
            res.redirect('/admin/categories');
        })
        .catch(error => {
            console.log(error);
            res.redirect('/admin/categories');
        });
}