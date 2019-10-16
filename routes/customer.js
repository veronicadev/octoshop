const express = require('express');
const customerController = require('./../controllers/customer');

const router = express.Router();

router.get('/orders', customerController.getOrders);
router.get('/dashboard', customerController.getDashboard);


module.exports = router;
