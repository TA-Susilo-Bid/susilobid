const authRouter = require('./authRouter');
const manageUserRouter = require('./manageUserRouter');
const manageSellerRouter = require('./manageSellerRouter');
const setBiddingRouter = require('./setBiddingRouter');
const productRouter = require('./productRouter');
const socketRouter = require('./socketRouter');
const biddingRouter = require('./biddingRouter');
const paymentRouter = require('./paymentRouter');
const walletRouter = require('./walletRouter');
const reportRouter = require('./reportRouter');
const profileRouter = require('./profileRouter');
const bidRouter = require('./bidRouter');
const cartRouter = require('./cartRouter');
const postProductRouter = require('./postProductRouter')

module.exports = {
    authRouter,
    manageUserRouter,
    manageSellerRouter,
    setBiddingRouter,
    productRouter,
    socketRouter,
    biddingRouter,
    paymentRouter,
    walletRouter,
    reportRouter,
    profileRouter,
    bidRouter,
    cartRouter,
    postProductRouter
};