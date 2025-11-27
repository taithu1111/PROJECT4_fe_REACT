import axios from "axios";
import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  UPDATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
} from "./ActionType";
import { API_BASE_URL } from "../../config/ApiConfig";

// ----- Register -----
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const user = response.data;

    if (user.token) {
      localStorage.setItem("jwt", user.token);
    }

    dispatch({
      type: REGISTER_SUCCESS,
      payload: { token: user.token, ...user },
    });

    return user.message;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({ type: REGISTER_FAILURE, payload: message });
    throw new Error(message);
  }
};

// ----- Login -----
export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
    const user = response.data;

    if (user.token) {
      localStorage.setItem("jwt", user.token);
    }

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token: user.token, ...user },
    });

    return user.token;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({ type: LOGIN_FAILURE, payload: message });
    throw new Error(message);
  }
};

// ----- Get User Profile -----
export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    dispatch({ type: GET_USER_SUCCESS, payload: response.data });
  } catch (error) {
    const message =
      error.response?.data?.message || "Cannot fetch user profile";
    dispatch({ type: GET_USER_FAILURE, payload: message });
  }
};

// ----- Update User Profile -----
export const updateUser = (userData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const response = await axios.put(
      `${API_BASE_URL}/api/users/profile`,
      userData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );

    dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Cannot update user profile";
    dispatch({ type: UPDATE_USER_FAILURE, payload: message });
    throw new Error(message);
  }
};

// ----- Change Password -----
export const changePassword = (passwordData) => async (dispatch) => {
  dispatch({ type: CHANGE_PASSWORD_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const response = await axios.put(
      `${API_BASE_URL}/api/users/change-password`,
      passwordData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );

    dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Cannot change password";
    dispatch({ type: CHANGE_PASSWORD_FAILURE, payload: message });
    throw new Error(message);
  }
};

// ----- Logout -----
export const logout = () => (dispatch) => {
  localStorage.removeItem("jwt");
  dispatch({ type: LOGOUT });
};
