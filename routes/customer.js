const express = require('express');
const customerController = require('./../controllers/customer');
const isAuth = require('./../middleware/is-auth');

const router = express.Router();

router.get('/orders', isAuth, customerController.getOrders);
router.get('/dashboard', isAuth, customerController.getDashboard);
router.get('/orders/:orderId', isAuth, customerController.getInvoice);

router.get('/information', isAuth, customerController.getInformation);

module.exports = router;