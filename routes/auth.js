const express = require('express');
const authController = require('./../controllers/auth');
const { check, body } = require('express-validator/check');
const User = require('./../models/user');
const router = express.Router();

router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);
router.get('/reset', authController.getReset);
router.get('/reset-password/:token', authController.getNewPassword);

router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),
    body('password')
    //.isLength({ min: 8 })
    //.withMessage("Enter a password with at least 8 characters")
    .isAlphanumeric()
    .withMessage("Enter a password with only numbers and text")
    .trim(),
], authController.postLogin);
router.post('/signup', [
        check('email')
        .isEmail()
        .withMessage('Invalid Email address')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email address already exists')
                    }
                });
        })
        .normalizeEmail(),
        body('username')
        .isAlphanumeric()
        .withMessage("Enter a username with only numbers and text")
        .trim(),
        body('password', "Enter a password with only numbers and text and at least 8 characters")
        .isLength({ min: 8 })
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords have to match!")
            }
            return true;
        })

    ],
    authController.postSignup);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);


module.exports = router;