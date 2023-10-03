const express = require('express');
const router = express.Router();
const Admin = require('../Models/adminModel');
const jwt = require('jsonwebtoken');
const adminAuth = require('../Middleware/adminAuth');
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const cors = require('cors');
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

const { deleteUserByID,adminDashBoard ,register, loginadmin, currentAdmin, logoutAdmin, resetPassword, adminUpadte, getallUsers , getallBlogs } = require('../Controller/adminController');

router.route('/login').post(loginadmin);
router.route('/adminDashBoard').get(adminAuth,adminDashBoard);
router.route('/register').post(adminAuth,register);
router.route('/about').get(adminAuth, currentAdmin);
router.route('/logout').get(adminAuth, logoutAdmin);
router.route('/resetPassword').post(adminAuth, resetPassword);
router.route('/updateAdmin').post(adminAuth, adminUpadte);
router.route('/getallUsers').get(adminAuth, getallUsers);
router.route('/getAllBlogs').get(adminAuth, getallBlogs);
router.route('/deleteUser/:id').delete(adminAuth, deleteUserByID);

module.exports = router;