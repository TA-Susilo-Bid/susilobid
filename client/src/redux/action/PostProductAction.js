import Axios from 'axios';
import { API_URL } from '../../support/API_URL';
import {
    POST_PRODUCT,
    API_POST_FAILED
} from '../Types';

export const postProduct = (form,id) => {
  return dispatch => {
    let headers = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }

    Axios.post(`${API_URL}/seller/post_product/${id}`, form, headers)
      .then(res => {
        console.log(res.data)
        let { category, name, desc, price, due_date, image } = res.data.data;
        dispatch({
          type: POST_PRODUCT,
          payload: {
            category, name, desc, price, due_date, image
          }
        });
      })
      .catch(err => {
        dispatch({
          type: API_POST_FAILED,
          payload: err
        });
      });
  };
};