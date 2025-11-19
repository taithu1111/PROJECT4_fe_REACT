import axios from "axios";
import { getAuthHeaders } from "./GetAuthHeaders";

const BASE_URL = "http://localhost:8080/api/orders";

export const createOrder = async (address) => {
    const res = await axios.post(BASE_URL + "/", address, {
        headers: getAuthHeaders()
    });
    return res.data;
};
