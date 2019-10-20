const Order = require('./../models/order');
const fs = require('fs');
const path = require('path');

exports.getOrders = (req, res, next) => {
    Order.find({ user: req.session.user._id })
        .then(orders => {
            res.render("customer/orders", {
                docTitle: "Orders",
                path: "/customer/orders",
                orders: orders
            });

        })
};

exports.getDashboard = (req, res, next) => {
    Order.find({ user: req.session.user._id })
        .then(orders => {
            res.render("customer/orders", {
                docTitle: "My Account",
                path: "/customer/orders",
                orders: orders
            });

        })
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoice = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoice);
    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                return next(new Error("No order found"));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error("Unathorized"));
            }
            console.log(invoicePath)
            fs.readFile(invoicePath, (err, data) => {
                if (err) {
                    return next(err);
                }
                res.setHeader('Content-Type', 'application/pdf');
                //res.setHeader('Content-Disposition', 'attachment; fileName="' + invoice + '"');
                res.setHeader('Content-Disposition', 'inline; fileName="' + invoice + '"'); //just for testing
                res.send(data);
            })
        })
        .catch(err => {
            return next(err);
        })
}