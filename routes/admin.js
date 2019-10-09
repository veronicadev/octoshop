const express = require('express');
const adminController = require('./../controllers/admin');
const isAuth = require('./../middleware/is-auth');
const { check, body } = require('express-validator/check');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);
router.post('/add-product', [
    body('title')
        .isAlphanumeric()
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isAlphanumeric(),
    body('description')
        .isLength({ min: 3 })
        .isAlphanumeric()
], isAuth, adminController.postAddProduct);
router.get('/edit-product/:productId', [
    body('title')
        .isAlphanumeric()
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isAlphanumeric(),
    body('description')
        .isLength({ min: 3 })
        .isAlphanumeric()
], isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;