const Order = require('./../models/order');
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const htmlPdf = require('html-pdf');
const PDFDocument = require('pdfkit');

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
    const template = path.join('pdf', 'invoice-template.pug');
    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                return next(new Error("No order found"));
            }
            if (order.user.toString() !== req.user._id.toString()) {
                return next(new Error("Unathorized"));
            }
            const data = pug.renderFile(template, {
                order: order,
                user: req.user
            });
            const options = { 
                format: 'A4', 
                type: "pdf",
                border: {
                    top: "1in",
                    right: "1in",
                    bottom: "1in",
                    left: "1in"
                }
            };
            htmlPdf.create(data, options).toFile(invoicePath, (err, result)=>{
                if (err) {
                    return next(err);
                }
                res.setHeader('Content-Type', 'application/pdf');
                //res.setHeader('Content-Disposition', 'inline; fileName="' + invoice + '"'); //just for testing
                res.setHeader('Content-Disposition', 'attachment; fileName="' + invoice + '"');
                res.sendFile(result.filename);

            });            
            /*const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(invoicePath)); //pdf creation
            pdfDoc.pipe(res); //add file to the response
            pdfDoc.text("TEST");
            pdfDoc.end();*/
        })
        .catch(err => {
            return next(err);
        })
}