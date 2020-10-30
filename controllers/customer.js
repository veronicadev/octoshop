const Order = require('./../models/order');
const path = require('path');
const pug = require('pug');
const htmlPdf = require('html-pdf');
const User = require('./../models/user');
const { validationResult } = require('express-validator/check');
const utils = require('./../util/utils');

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

exports.getInformation =(req, res, next) =>{
    res.render('customer/information', {
        docTitle: "Account information",
        path: "/customer/information",
        infoMessage: utils.getFlashMessage(req, 'info')
    })
}

exports.postInformation =(req, res, next) =>{
    const errorsVal = validationResult(req);
    const currentUser = {
        name: req.body.name,
        surname: req.body.surname,
        company: req.body.company,
        country: req.body.country,
        streetAddress: req.body.streetAddress,
        postcode: req.body.postcode,
        city: req.body.city,
        province: req.body.province,
        phone: req.body.phone,
        email: req.body.email
    };
    if (!errorsVal.isEmpty()) {
        return res.status(422).render("customer/information", {
            docTitle: "Account information",
            path: "/customer/information",
            errorMessage: utils.getValidationMessage(errorsVal),
            validationErrors: errorsVal.array(),
            infoMessage: null,
            user: currentUser
        });
    }
    req.user.name= currentUser.name;
    req.user.surname= currentUser.surname;
    req.user.company= currentUser.company;
    req.user.country= currentUser.country;
    req.user.streetAddress= currentUser.streetAddress;
    req.user.postcode= currentUser.postcode;
    req.user.city= currentUser.city;
    req.user.province= currentUser.province;
    req.user.phone= currentUser.phone;
    User.findOne({email:currentUser.email, _id:{$ne: req.user._id}})
    .then(userFetched=>{
        if(userFetched){
            return res.status(422).render("customer/information", {
                docTitle: "Account information",
                path: "/customer/information",
                errorMessage: 'Email already used by another user.',
                validationErrors: [],
                infoMessage: null,
                user: currentUser
            });
        }
        req.user.email= currentUser.email;
        req.user.save().then(result =>{
            req.flash('info', "Account information updated successfully");
            res.redirect('/customer/information');
        })
    })

    .catch(err=>{
        return next(err);
    })
}