import axios from "axios";
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
import { API_BASE_URL } from "../../config/ApiConfig";

// Create a new order
export const createOrder = (address) => async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");
        const payload = {
            city: address.city,
            street_address: address.streetAddress,
            zip_code: address.zipCode,
        };

        const response = await axios.post(
            `${API_BASE_URL}/api/orders/`,
            payload,
            {
                headers: { Authorization: `Bearer ${jwt}` },
            }
        );

        dispatch({ type: CREATE_ORDER_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message || "Cannot create order";
        dispatch({ type: CREATE_ORDER_FAILURE, payload: message });
        throw new Error(message);
    }
};

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

// Confirm Order
export const confirmedOrder = (orderId) => async (dispatch) => {
    dispatch({ type: CONFIRMED_ORDER_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");
        const response = await axios.put(`${API_BASE_URL}/api/orders/${orderId}/confirmed`, {}, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        dispatch({ type: CONFIRMED_ORDER_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message || "Cannot confirm order";
        dispatch({ type: CONFIRMED_ORDER_FAILURE, payload: message });
        throw new Error(message);
    }
};

export const deleteOrder = (orderId) => async (dispatch) => {
    dispatch({ type: DELETE_ORDER_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");

        await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        dispatch({ type: DELETE_ORDER_SUCCESS, payload: orderId });

        // refresh order list
        dispatch(getUserOrders());
    } catch (error) {
        const message =
            error.response?.data?.message || "Cannot delete order";
        dispatch({ type: DELETE_ORDER_FAILURE, payload: message });
        throw new Error(message);
    }
};