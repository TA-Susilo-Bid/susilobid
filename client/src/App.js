import React, { Fragment, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { keepLogin, checkStatus, Logout } from './redux/action';

// children
import {
  Home,
  Register,
  Admin,
  Verify,
  NotFound,
  ProductDetail,
  BiddingPage,
  WalletPage,
  EditProfile,
  Cart,
  AddProduct,
  Product
} from './pages';
import Header from './components/Header';

const App = () => {

  const dispatch = useDispatch();

  const role = useSelector(({ auth }) => auth.role_id);
  const id = useSelector(({ auth }) => auth.user_id);
  const status = useSelector(({ status }) => status.status);

  useEffect(() => {
    dispatch(keepLogin());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkStatus(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (status === 'Banned') dispatch(Logout());
  }, [dispatch, status]);
  
  return (
    <Fragment>
      {
        role !== 1
        ?
        <Header/>
        :
        null
      }
          <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/register' component={Register} />
          <Route path='/verify' component={Verify} />
          <Route path='/product-detail' component={ProductDetail} />
          <Route path='/wallet' component={WalletPage} />
          <Route path='/bidding-page' component={BiddingPage} />
          <Route path='/edit-profile' component={EditProfile} />
          <Route path='/cart' component={Cart} />
          <Route path='/add-product' component={AddProduct} />
          <Route path='/products' component={Product} />
            {
              role === 1
              ?
              <Route path='/internal' component={Admin} />
              : 
              null
            }
          <Route path='*' component={NotFound} />
        </Switch>
    </Fragment>
  );
};

export default App;