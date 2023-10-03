const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userAuth = require('../Middleware/userAuth');
const adminAuth = require('../Middleware/adminAuth');
const cookieParser = require("cookie-parser");
router.use(cookieParser());


const {uploadBlog,updateBlog,viewallBlogs,viewBlogbyID,deleteBlog} = require('../Controller/blogController');


// Admin Routes
router.route('/admin/uploadBlog').post(adminAuth,uploadBlog)
router.route('/admin/updateBlog/:id').put(adminAuth,updateBlog)
router.route('/admin/deleteBlog/:id').delete(adminAuth,deleteBlog)

// User Routes
router.route('/user/view').get(viewallBlogs)
router.route('/user/view/:id').get(viewBlogbyID)





module.exports = router