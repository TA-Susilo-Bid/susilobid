import { combineReducers } from 'redux';
import { authReducer } from './AuthReducer';
import { ModalReducer } from './ModalReducer';
import { userReducer } from './userReducer';
import { sellerReducer } from './SellerReducer';
import { checkStatusReducer } from './CheckStatusReducer';
import { setBidding } from './SetBiddingReducer';
import { fetchProduct } from './ProductReducer';
import { getServerTime } from './ServerTimeReducer';
import { addTopupReducer } from './PaymentReducer';
import { getWalletReducer } from './WalletReducer';
import { reportReducer } from './ReportReducer';
import { ProfileReducer } from './ProfileReducer';
import { ActiveAuctionsReducer } from './ActiveAuctionsReducer';
import { CartReducer } from './CartReducer';
import { postProductReducer } from './PostProductReducer';

export default combineReducers({
    auth : authReducer,
    modal : ModalReducer,
    user : userReducer,
    seller : sellerReducer,
    status : checkStatusReducer,
    product : fetchProduct,
    serverTime : getServerTime,
    topup : addTopupReducer,
    wallet: getWalletReducer,
    report : reportReducer,
    setBidding,
    profile : ProfileReducer,
    activeBid : ActiveAuctionsReducer,
    cart: CartReducer,
    postProduct : postProductReducer
});