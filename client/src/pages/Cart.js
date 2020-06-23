import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, checkStatus, Logout } from '../redux/action';
import { Redirect } from 'react-router-dom';

const Cart = () => {

    const dispatch = useDispatch();

    const role = useSelector(({ auth }) => auth.role_id);
    const id = useSelector((state) => state.auth.user_id);
    const cartList = useSelector((state) => state.cart.cartList);
    const logged = useSelector(({ auth }) => auth.logged);
    const status = useSelector(({ status }) => status.status);
    
    useEffect(() => {
        dispatch(getCart(id));
    }, [dispatch, id]);

    useEffect(() => {
        dispatch(checkStatus(id));
    }, [id]);

    useEffect(() => {
        if (status === 'Banned') dispatch(Logout());
    }, [status]);

    const renderCartA = () => {
        return cartList.map((val,idx) => {
            return (
                <tr key={idx}>
                    <td>{val.cart_id}</td>
                    <td>{val.user_id}</td>
                    <td>{val.bid_result_id}</td>
                    <td>{val.amount}</td>
                </tr>
            );
        });
    };

    if (role === 1) {
        return <Redirect to='/internal' />
    }
    if (!logged) {
        return <Redirect to='/' />
    }
    return (
        <div>
            <div className='d-flex justify-content-between'>
                <table className='ui single line table' style={{ marginLeft: "20px", marginRight: "20px" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Bid Result ID</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderCartA()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Cart;