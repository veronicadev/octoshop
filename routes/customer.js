const express = require('express');
const customerController = require('./../controllers/customer');
const isAuth = require('./../middleware/is-auth');
const { check, body } = require('express-validator/check');

const router = express.Router();

router.get('/orders', isAuth, customerController.getOrders);
router.get('/dashboard', isAuth, customerController.getDashboard);
router.get('/invoice/:orderId', isAuth, customerController.getInvoice);

router.get('/information', isAuth, customerController.getInformation);
router.post('/update-information', [
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
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),
    body('phone')
    .isString()
    .trim()
    .escape()
], isAuth, customerController.postInformation);

module.exports = router;