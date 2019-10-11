const express = require('express');
const adminController = require('./../controllers/admin');
const isAuth = require('./../middleware/is-auth');
const { check, body } = require('express-validator/check');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);
router.post('/add-product', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim()
        .withMessage('Title must contain at least 3 characters'),
    body('imageUrl')
        .isURL()
        .withMessage('Please enter URL as image'),
    body('price')
        .isFloat(),
    body('description')
        .isLength({ min: 3 })
        .withMessage('Description must contain at least 3 characters')
], isAuth, adminController.postAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product',[
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim()
        .withMessage('Title must contain at least 3 characters'),
    body('imageUrl')
        .isURL()
        .withMessage('Please enter URL as image'),
    body('price')
        .isFloat(),
    body('description')
        .isLength({ min: 3 })
        .withMessage('Description must contain at least 3 characters')
], isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;