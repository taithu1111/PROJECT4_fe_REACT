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
} from "./ActionType";
import { API_BASE_URL } from "../../config/ApiConfig";

const token = localStorage.getItem("jwt");

// xu li met vl =))

const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload: user });
const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });

export const register = (userData) => async (dispatch) => {
  dispatch(registerRequest());

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const user = response.data;
    if (user.token) {
      localStorage.setItem("jwt", user.token);
    }
    console.log("user", user);
    dispatch(registerSuccess(user.token));
    return user.message;
  } catch (error) {
    console.log("Lỗi sever : ", error.response);
    const message =
      error.response?.data?.message || error.message;

    dispatch(registerFailure(message));
    throw new Error(message);
  }
};

const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

export const login = (userData) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
    const user = response.data;
    if (user.token) {
      localStorage.setItem("jwt", user.token);
    }
    console.log("user", user);
    dispatch(loginSuccess(user.token));
  } catch (error) {
    const message =
      error.response?.data?.message || error.message;
    dispatch(registerFailure(message));

    dispatch(loginFailure(message));
    console.error("Register error:", message);
    throw new Error(message);
  }
};

const getUserRequest = () => ({ type: GET_USER_REQUEST });
const getUserSuccess = (user) => ({ type: GET_USER_SUCCESS, payload: user });
const getUserFailure = (error) => ({ type: GET_USER_FAILURE, payload: error });

export const getUser = (jwt) => async (dispatch) => {
  dispatch(getUserRequest());

  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const user = response.data;
    console.log("User profile từ BE:", user);
    dispatch(getUserSuccess(user));
  } catch (error) {
    console.error("Lỗi khi gọi getUser:", error.response || error.message);
    const message =
      error.response?.data?.message || "Không thể lấy thông tin người dùng.";
    dispatch(getUserFailure(message));
  }
};


export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT, payload: null });
};
