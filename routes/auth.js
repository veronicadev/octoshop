const express = require('express');
const authController = require('./../controllers/auth');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);
router.get('/reset', authController.getReset);
router.get('/reset-password/:token', authController.getNewPassword);

router.post('/login', authController.postLogin);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);

module.exports = router;