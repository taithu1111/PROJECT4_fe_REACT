import {
    GET_ORDERS_FAILURE,
    GET_ORDERS_REQUEST,
    GET_ORDERS_SUCCESS,
    GET_ORDER_BY_ID_FAILURE,
    GET_ORDER_BY_ID_REQUEST,
    GET_ORDER_BY_ID_SUCCESS,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    CONFIRMED_ORDER_REQUEST,
    CONFIRMED_ORDER_SUCCESS,
    CONFIRMED_ORDER_FAILURE,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_FAILURE,
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
        case CREATE_ORDER_REQUEST:
        case CONFIRMED_ORDER_REQUEST:
            return { ...state, isLoading: true, error: null };

        case GET_ORDERS_SUCCESS:
            return { ...state, isLoading: false, orders: action.payload, error: null };

        case GET_ORDER_BY_ID_SUCCESS:
        case CREATE_ORDER_SUCCESS:
        case CONFIRMED_ORDER_SUCCESS:
            return { ...state, isLoading: false, order: action.payload, error: null };

        case GET_ORDERS_FAILURE:
        case GET_ORDER_BY_ID_FAILURE:
        case CREATE_ORDER_FAILURE:
        case CONFIRMED_ORDER_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        case DELETE_ORDER_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case DELETE_ORDER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                orders: state.orders.filter(
                    (order) => order.id !== action.payload
                ),
            };

        case DELETE_ORDER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };


        default:
            return state;
    }
};
