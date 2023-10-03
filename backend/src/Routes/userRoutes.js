const express = require('express');
const router = express.Router();
const User = require('../Models/userModels');
const jwt = require('jsonwebtoken');
const userAuth = require('../Middleware/userAuth');
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const cors = require('cors');
// router.use(cors());
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));


const {checkPaymentPage,getReferalToken,createNew,login,currentUser,logoutUser , resetPassword , userUpadte, textAnalyzer, subscription,createNew_google, login_google, createNew_facebook, login_facebook, create_payment_stripe} = require('../Controller/userController');

router.route('/register').post(createNew);
router.route('/register_google').post(createNew_google);
// router.route('/register_facebook').post(createNew_facebook);
router.route('/login').post(login);
router.route('/login_google').post(login_google);
// router.route('/login_facebook').post(login_facebook);
router.route('/about').get(userAuth,currentUser);
router.route('/logout').get(userAuth,logoutUser);
router.route('/resetPassword').post(userAuth,resetPassword);
router.route('/updateUser').post(userAuth,userUpadte);
router.route('/textAnalyser').post(userAuth,textAnalyzer);
router.route('/subscribe').post(userAuth,subscription);
router.route('/create-payment-stripe').post(userAuth,create_payment_stripe);
router.route('/getReferalToken').get(userAuth,getReferalToken);
router.route('/checkPaymentPageForStripe').get(userAuth,checkPaymentPage);

module.exports = router ;