const express = require('express');
const router = express.Router();
const context = require('../controller/userController')
router.get('/signup',context.signup_get);
router.post('/signup',context.signup_post);
router.get('/login',context.login_get);
router.post('/login',context.login_post);
router.get('/logout',context.logOut_get);
router.get('/sendmail',context.sendEmail_get);
router.post('/sendmail',context.sendEmail_post);
router.get('/refresh',context.refreshToken);
router.get('/data',context.data);
module.exports = router;