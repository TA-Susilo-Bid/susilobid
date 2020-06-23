import Axios from 'axios';
import { API_URL } from '../../support/API_URL';
import {
  FETCH_DATA_START,
  FETCH_PRODUCT_PAGE,
  FETCH_DATA_BY_PRODUCTID,
  GET_CATEGORY,
  FETCH_DATA_BY_CATEGORY,
  FETCH_DATA_MIN_PRICE,
  FETCH_DATA_MAX_PRICE,
  FETCH_DATA_BY_RANGE_PRICE,
  FETCH_DATA_BY_CATEGORY_AND_PRICE,
  FETCH_DATA_CATEG_MIN,
  FETCH_DATA_CATEG_MAX,
  FETCH_DATA_BY_NAME,
  FETCH_DATA_BY_TIME,
  FETCH_DATA_BY_PRICE,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILED,
  FETCH_DATA_CLOSE,
  FETCH_DATA_CLOSE_CTG,
  FETCH_ACTIVE_PRODUCT_PAGE,
  FETCH_PENDING_PRODUCT_PAGE,
  FETCH_FINISH_PRODUCT_PAGE
} from '../Types';

export const FetchProduct = (productPerPage, offset, orderBy) => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.get(`${API_URL}/product/get-product/${productPerPage}/${offset}/${orderBy}`);
      // console.log(res.data.data)
      dispatch({
        type: FETCH_PRODUCT_PAGE,
        payload: res.data.data,
        count: res.data.count
      });
      dispatch({
        type: FETCH_DATA_SUCCESS
      });
    } catch (err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    };
  };
};

export const FetchProductActive = (productPerPage, offset, sellerId) => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.get(`${API_URL}/product/product-active/${productPerPage}/${offset}/${sellerId}`);
      console.log(res.data.data)
      dispatch({
        type: FETCH_ACTIVE_PRODUCT_PAGE,
        payload: res.data.data,
        count: res.data.count
      });
      dispatch({
        type: FETCH_DATA_SUCCESS
      });
    } catch (err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    };
  };
};

export const FetchProductPending = (productPerPage, offset, sellerId) => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.get(`${API_URL}/product/product-pending/${productPerPage}/${offset}/${sellerId}`);
      console.log(res.data.data)
      dispatch({
        type: FETCH_PENDING_PRODUCT_PAGE,
        payload: res.data.data,
        count: res.data.count
      });
      dispatch({
        type: FETCH_DATA_SUCCESS
      });
    } catch (err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    };
  };
};

export const FetchProductFinish = (productPerPage, offset, sellerId) => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.get(`${API_URL}/product/product-finish/${productPerPage}/${offset}/${sellerId}`);
      console.log(res.data.data)
      dispatch({
        type: FETCH_FINISH_PRODUCT_PAGE,
        payload: res.data.data,
        count: res.data.count
      });
      dispatch({
        type: FETCH_DATA_SUCCESS
      });
    } catch (err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    };
  };
};

export const FetchDataByProductId = productId => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.get(`${API_URL}/product/get-product/${productId}`);
      // console.log(res.data)
      dispatch({
        type: FETCH_DATA_BY_PRODUCTID,
        payload: res.data
      });
      dispatch({
        type: FETCH_DATA_SUCCESS
      });
    } catch (err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    };
  };
};

export const GetCategory = () => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.get(`${API_URL}/product/get-category`);
      dispatch({
        type: GET_CATEGORY,
        payload: res.data
      });
      dispatch({
        type: FETCH_DATA_SUCCESS
      });
    } catch (err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataByCategory = ctg => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-by-category/${ctg}`);
      dispatch({
        type: FETCH_DATA_BY_CATEGORY,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataMinPrice = prc => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-min-price/${prc}`);
      dispatch({
        type: FETCH_DATA_MIN_PRICE,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataMaxPrice = prc => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-max-price/${prc}`);
      dispatch({
        type: FETCH_DATA_MAX_PRICE,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataByRangePrice = (min, max) => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-range-price/${min}/${max}`);
      dispatch({
        type: FETCH_DATA_BY_RANGE_PRICE,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataByCategoryAndPrice = (ctg, min, max) => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-category-and-price/${ctg}/${min}/${max}`);
      dispatch({
        type: FETCH_DATA_BY_CATEGORY_AND_PRICE,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataCategMin = (ctg, min) => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-category-and-min/${ctg}/${min}`);
      dispatch({
        type: FETCH_DATA_CATEG_MIN,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataCategMax = (ctg, max) => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-category-and-max/${ctg}/${max}`);
      dispatch({
        type: FETCH_DATA_CATEG_MAX,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataByName = name => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-by-name/${name}`);
      dispatch({
        type: FETCH_DATA_BY_NAME,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataByTime = orderBy => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-by-time/${orderBy}`);
      dispatch({
        type: FETCH_DATA_BY_TIME,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataByPrice = orderBy => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-by-price/${orderBy}`);
      dispatch({
        type: FETCH_DATA_BY_PRICE,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataClose = (productPerPage, offset) => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-status-close/${productPerPage}/${offset}`);
      dispatch({
        type: FETCH_DATA_CLOSE,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      console.log(err);
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
};

export const FetchDataCloseCtg = (limit, offset, ctg) => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_DATA_START
      });
      let res = await Axios.post(`${API_URL}/product/get-close-ctg/${limit}/${offset}/${ctg}`);
      dispatch({
        type: FETCH_DATA_CLOSE_CTG,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      console.log(err);
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: err
      });
    }
  };
}