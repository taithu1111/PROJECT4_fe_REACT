import axios from "axios";
import {
    GET_ORDERS_FAILURE,
    GET_ORDERS_REQUEST,
    GET_ORDERS_SUCCESS,
    GET_ORDER_BY_ID_FAILURE,
    GET_ORDER_BY_ID_REQUEST,
    GET_ORDER_BY_ID_SUCCESS,
} from "./ActionType";
import { API_BASE_URL } from "../../config/ApiConfig";

// Get all orders for the logged-in user
export const getUserOrders = () => async (dispatch) => {
    dispatch({ type: GET_ORDERS_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");
        const response = await axios.get(`${API_BASE_URL}/api/orders/user`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        dispatch({ type: GET_ORDERS_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message || "Cannot fetch orders";
        dispatch({ type: GET_ORDERS_FAILURE, payload: message });
        throw new Error(message);
    }
};

// Get order by ID
export const getOrderById = (orderId) => async (dispatch) => {
    dispatch({ type: GET_ORDER_BY_ID_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");
        const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        dispatch({ type: GET_ORDER_BY_ID_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message || "Cannot fetch order details";
        dispatch({ type: GET_ORDER_BY_ID_FAILURE, payload: message });
        throw new Error(message);
    }
};
