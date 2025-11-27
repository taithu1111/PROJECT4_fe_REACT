import {
    GET_ORDERS_FAILURE,
    GET_ORDERS_REQUEST,
    GET_ORDERS_SUCCESS,
    GET_ORDER_BY_ID_FAILURE,
    GET_ORDER_BY_ID_REQUEST,
    GET_ORDER_BY_ID_SUCCESS,
} from "./ActionType";

const initialState = {
    orders: [],
    order: null,
    isLoading: false,
    error: null,
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORDERS_REQUEST:
        case GET_ORDER_BY_ID_REQUEST:
            return { ...state, isLoading: true, error: null };

        case GET_ORDERS_SUCCESS:
            return { ...state, isLoading: false, orders: action.payload, error: null };

        case GET_ORDER_BY_ID_SUCCESS:
            return { ...state, isLoading: false, order: action.payload, error: null };

        case GET_ORDERS_FAILURE:
        case GET_ORDER_BY_ID_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        default:
            return state;
    }
};
