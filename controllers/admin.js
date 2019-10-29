const Product = require('./../models/product');
const Category = require('./../models/category');
const mongoose = require('mongoose');
const canUser = require('./../util/roles').canUser;
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
    Category.find().then((categories => {
        res.render("admin/edit-product", {
            docTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            formAction: '/admin/add-product',
            product: product,
            title: "Add product",
            errorMessage: null,
            categories: categories,
            infoMessage: utils.getFlashMessage(req, 'info'),
            validationErrors: []
        });
    }))
        .catch(err => {
            const newError = new Error(err);
            newError.httpStatusCode = 500;
            return next(newError);
        });
}

exports.getProducts = (req, res, next) => {
    Product.find()
        /*        .then(prods => {
                    return prods.populate('category')
                    .execPopulate();
                })*/
        .then(products => {
            res.render("admin/products", {
                prods: products,
                docTitle: "Home",
                infoMessage: utils.getFlashMessage(req, 'info'),
                errorMessage: null,
                path: "/admin/products"
            });
        })
        .catch(err => {
            const newError = new Error(err);
            newError.httpStatusCode = 500;
            return next(newError);
        });
}

exports.postAddProduct = (req, res, next) => {
    if (canUser('create', 'product', req.user.roleType.name)) {
        const image = req.file;
        const errorsVal = validationResult(req);
        if (!image) {
            return res.status(422).render("admin/edit-product", {
                docTitle: "Add Product",
                path: "/admin/add-product",
                editing: false,
                formAction: '/admin/add-product',
                errorMessage: 'Attached file is not an image',
                validationErrors: [],
                infoMessage: null,
                title: "Add product",
                product: {
                    title: req.body.title,
                    description: req.body.description,
                    price: req.body.price,
                    category: req.body.category
                }
            });
        }
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
                product: {
                    title: req.body.title,
                    description: req.body.description,
                    price: req.body.price,
                    category: req.body.category
                }
            });
        }
        console.log(image)
        const newProduct = new Product({
            title: req.body.title,
            description: req.body.description,
            imageUrl: image.destination + image.filename,
            price: req.body.price,
            category: mongoose.Types.ObjectId(req.body.category),
            userId: req.user._id
        });
        newProduct.save()
            .then(prod => {
                req.flash('info', 'Product "' + req.body.title + '" created!');
                console.log('Product created!', prod);
            })
            .then(() => {
                res.redirect('/admin/products');
            })
            .catch(error => {
                const newError = new Error(error);
                newError.httpStatusCode = 500;
                return next(newError);
            });
    } else {
        const newError = new Error('403 Unauthorized');
        newError.httpStatusCode = 403;
        return next(newError);
    }
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) { res.redirect('/admin/products'); } // redirect to admin
    const productId = req.params.productId;
    Promise.all([
        Product.findById(productId),
        Category.find()
    ])
        .then(([product, categories]) => {
            console.log(product)
            if (!product) { return res.redirect('/admin/products'); }
            res.render("admin/edit-product", {
                docTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
                formAction: '/admin/edit-product',
                title: "Update product",
                categories: categories,
                infoMessage: utils.getFlashMessage(req, 'info'),
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            const newError = new Error(err);
            newError.httpStatusCode = 500;
            return next(newError);
        });
}

exports.postEditProduct = (req, res, next) => {
    if (canUser('update', 'product', req.user.roleType.name)) {
        const productId = req.body.productId;
        const image = req.file;
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
                product: {
                    _id: productId,
                    title: req.body.title,
                    description: req.body.description,
                    price: req.body.price,
                    category: req.body.category
                }
            });
        }
        Product.findById(productId)
            .then(product => {
                if (!product) { return res.redirect('/admin/products'); }
                product.title = req.body.title;
                console.log(image)
                if (image) {
                    utils.deleteFile(product.imageUrl);
                    product.imageUrl = image.path;
                }
                product.description = req.body.description;
                product.category = mongoose.Types.ObjectId(req.body.category);
                product.price = req.body.price;
                product.save()

            })
            .then(prod => {
                req.flash('info', 'Product "' + req.body.title + '" updated!');
                res.redirect('/admin/products');
            })
            .catch(error => {
                const newError = new Error(error);
                newError.httpStatusCode = 500;
                return next(newError);
            });
    } else {
        const newError = new Error('403 Unauthorized');
        newError.httpStatusCode = 403;
        return next(newError);
    }
}

exports.postDeleteProduct = (req, res, next) => {
    if (canUser('delete', 'product', req.user.roleType.name)) {
        const productId = req.body.productId;
        Product.findById(productId).then(prod => {
            if (!prod) return next(new Error('Product not found'))
            utils.deleteFile(prod.imageUrl);
            return Product.findByIdAndRemove(productId);
        })
            .then(result => {
                req.flash('info', 'Product deleted!');
                res.redirect('/admin/products');
            })
            .catch(error => {
                const newError = new Error(error);
                newError.httpStatusCode = 500;
                return next(newError);
            });
    } else {
        const newError = new Error('403 Unauthorized');
        newError.httpStatusCode = 403;
        return next(newError);
    }
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
        infoMessage: utils.getFlashMessage(req, 'info'),
        errorMessage: null,
        validationErrors: []
    });
}

exports.getCategories = (req, res, next) => {
    Category.find()
        .then(cats => {
            res.render("admin/categories", {
                cats: cats,
                docTitle: "Categories",
                infoMessage: utils.getFlashMessage(req, 'info'),
                errorMessage: null,
                path: "/admin/categories",
            });
        });
}

exports.postAddCategory = (req, res, next) => {
    if (canUser('create', 'category', req.user.roleType.name)) {
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
                req.flash('info', 'Category "' + req.body.name + '" created!');
                console.log('Category created!', category);
                res.redirect('/admin/categories');
            })
            .catch(error => {
                console.log('Category not created!', error);
                res.redirect('/admin/categories');
            });
    } else {
        const newError = new Error('403 Unauthorized');
        newError.httpStatusCode = 403;
        return next(newError);
    }

}

exports.postDeleteCategory = (req, res, next) => {
    if (canUser('delete', 'category', req.user.roleType.name)) {
        const catId = req.body.catId;
        Category.findByIdAndRemove(catId)
            .then(result => {
                req.flash('info', 'Category deleted!');
                res.redirect('/admin/categories');
            })
            .catch(error => {
                const newError = new Error(error);
                newError.httpStatusCode = 500;
                return next(newError);;
            })
    }else {
        const newError = new Error('403 Unauthorized');
        newError.httpStatusCode = 403;
        return next(newError);
    }
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
                infoMessage: utils.getFlashMessage(req, 'info'),
                errorMessage: null,
                validationErrors: []
            });
        });
}

exports.postEditCategory = (req, res, next) => {
    if (canUser('update', 'category', req.user.roleType.name)) {
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
                req.flash('info', 'Category "' + req.body.name + '" updated!');
                res.redirect('/admin/categories');
            })
            .catch(error => {
                const newError = new Error(error);
                newError.httpStatusCode = 500;
                return next(newError);
            });
    }else {
        const newError = new Error('403 Unauthorized');
        newError.httpStatusCode = 403;
        return next(newError);
    }
}