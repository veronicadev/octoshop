const express = require('express');
const authController = require('./../controllers/auth');
const { check, body } = require('express-validator/check');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);
router.get('/reset', authController.getReset);
router.get('/reset-password/:token', authController.getNewPassword);

router.post('/login', authController.postLogin);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Invalid Email address'),
        body('password', "Enter a password with only numbers and text and at least 8 characters")
            .isLength({min:8})
            .isAlphanumeric(),
        body('confirmPassword')
            .custom((value, {req})=>{
                console.log(value)
                console.log(req.body.password)
                if(value !== req.body.password){
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