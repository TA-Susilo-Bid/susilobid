const authController = require('./authController');
const manageUserController = require('./manageUserController');
const manageSellerController = require('./manageSellerController');
const setBiddingController = require('./setBiddingController');
const productController = require('./productController');
const socketController = require('./socketController');
const biddingController = require('./biddingController');
const paymentController = require('./paymentController');
const walletController = require('./walletController');
const reportController = require('./reportController');
const profileController = require('./profileController');
const bidController = require('./bidController');
const cartController = require('./cartController');
const postProductController = require('./PostProductController');

module.exports = {
    authController,
    manageUserController,
    manageSellerController,
    setBiddingController,
    productController,
    socketController,
    biddingController,
    paymentController,
    walletController,
    reportController,
    profileController,
    bidController,
    cartController,
    postProductController
};