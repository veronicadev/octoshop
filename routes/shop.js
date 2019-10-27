const express = require('express');
const shopController = require('./../controllers/shop');
const isAuth = require('./../middleware/is-auth');
const { check, body } = require('express-validator/check');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/categories/:catId', shopController.getCategory);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.post('/create-order', [
    body('name')
    .isString()
    .trim()
    .escape(),
    body('surname')
    .isString()
    .trim()
    .escape(),
    body('company')
    .isString()
    .trim()
    .escape(),
    body('country')
    .isString()
    .trim()
    .escape(),
    body('streetAddress')
    .isString()
    .trim()
    .escape(),
    body('postcode')
    .isString()
    .trim()
    .escape(),
    body('city')
    .isString()
    .trim()
    .escape(),
    body('province')
    .isString()
    .trim()
    .escape(),
    body('phone')
    .isString()
    .trim()
    .escape(),
    body('notes')
    .isString()
    .trim()
    .escape()
], isAuth, shopController.postOrder);

module.exports = router;