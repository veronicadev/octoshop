const express = require('express');
const authController = require('./../controllers/auth');
const { check } = require('express-validator/check');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);
router.get('/reset', authController.getReset);
router.get('/reset-password/:token', authController.getNewPassword);

router.post('/login', authController.postLogin);
router.post('/signup', check('email').isEmail().withMessage('Invalid Email address'), authController.postSignup);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);


module.exports = router;