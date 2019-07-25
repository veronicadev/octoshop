const express = require('express');
const shopController = require('./../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/checkout', shopController.getCheckout);
router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

module.exports = router;