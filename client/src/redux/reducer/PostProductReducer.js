import {
  POST_PRODUCT,
  API_POST_FAILED
} from '../Types';

const INITIAL_STATE = {
  category: '',
  name: '',
  desc: '',
  price: '',
  due_date: '',
  image: '',
  error: false
};

export const postProductReducer = (state = INITIAL_STATE, action) => {
  switch(action.type){
      case POST_PRODUCT :
          return {
              ...state,
              ...action.payload
          };
      case API_POST_FAILED :
          return {
              ...state,
              error : true
          }
      default :
          return state;
  };
};