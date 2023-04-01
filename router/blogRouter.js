const express = require('express');
const router = express.Router();
const context = require('../controller/blogController');
const multiparty = require('connect-multiparty');
const {requireUser,checkUser} = require('../middleware/authMiddleware');
const multipartyMiddleware =  multiparty();
const multer = require('../multer')
router.get('*',checkUser)
router.get('/',context.index)
router.get('/page/:p',context.pages)
router.get('/create',context.create_get);
router.get('/edit/:id',context.edit_get);
router.get('/detail/:id',context.detail_get);
router.post('/upload',multipartyMiddleware,context.uploadImg);
router.post('/create',requireUser,context.create_post);
router.post('/post/:id',context.edit_patch);
router.get('/data/:p',context.blogData);
router.get('/search',context.search)
router.delete('/delete/:id',context.delete_blog);
module.exports = router;