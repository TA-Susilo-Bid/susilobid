import {
    FETCH_DATA_START,
    FETCH_PRODUCT_PAGE,
    FETCH_DATA_BY_PRODUCTID,
    GET_CATEGORY,
    FETCH_DATA_BY_CATEGORY,
    FETCH_DATA_SUCCESS,
    FETCH_DATA_MIN_PRICE,
    FETCH_DATA_MAX_PRICE,
    FETCH_DATA_BY_RANGE_PRICE,
    FETCH_DATA_BY_CATEGORY_AND_PRICE,
    FETCH_DATA_CATEG_MIN,
    FETCH_DATA_CATEG_MAX,
    FETCH_DATA_BY_NAME,
    FETCH_DATA_BY_TIME,
    FETCH_DATA_BY_PRICE,
    FETCH_DATA_CLOSE,
    FETCH_DATA_CLOSE_CTG,
    FETCH_DATA_FAILED,
    FETCH_ACTIVE_PRODUCT_PAGE,
    FETCH_PENDING_PRODUCT_PAGE,
    FETCH_FINISH_PRODUCT_PAGE
} from '../Types';

const INNITIAL_STATE = {
    product: [],
    category: [],
    count: 0,
    error: '',
    loading: false,
    productById: {}
};

export const fetchProduct = (state = INNITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_DATA_START:
            return {
                ...state,
                loading: true
            };
        case FETCH_ACTIVE_PRODUCT_PAGE:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_PENDING_PRODUCT_PAGE:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_FINISH_PRODUCT_PAGE:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case FETCH_PRODUCT_PAGE:
            return {
                ...state,
                product: [...action.payload],
                count: action.count
            };
        case FETCH_DATA_BY_PRODUCTID:
            return {
                ...state,
                productById: action.payload
            };
        case FETCH_DATA_BY_CATEGORY:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_MIN_PRICE:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_MAX_PRICE:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_BY_RANGE_PRICE:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_BY_CATEGORY_AND_PRICE:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_CATEG_MIN:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_CATEG_MAX:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_BY_NAME:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_BY_TIME:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_BY_PRICE:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_CLOSE:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case FETCH_DATA_CLOSE_CTG:
            return {
                ...state,
                product: [...action.payload],
                count: action.count,
                loading: false
            };
        case GET_CATEGORY:
            return {
                ...state,
                category: [...action.payload],
                loading: false
            };
        case FETCH_DATA_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default: return state;
    };
};