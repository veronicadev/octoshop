const express = require('express');
const shopController = require('./../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/checkout', shopController.getCheckout);
router.get('/cart', shopController.getCart);

module.exports = router;