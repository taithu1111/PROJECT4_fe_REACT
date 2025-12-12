// src/api/AdminOrderService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin/orders';

// Lấy token từ localStorage
const getAuthToken = () => {
    return localStorage.getItem('jwt');
};
const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminOrderService = {
    getAllOrders: async (page = 0, size = 10, sortBy = null) => {
        try {
            const params = { page, size };
            if (sortBy) params.sortBy = sortBy;

            const response = await axios.get(`${API_BASE_URL}/`, {
                params,
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },
    // Confirm order
    placedOrder: async (orderId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${orderId}/place`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error confirming order:', error);
            throw error;
        }
    },

    confirmOrder: async (orderId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${orderId}/confirmed`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error confirming order:', error);
            throw error;
        }
    },

    // Ship order
    shipOrder: async (orderId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${orderId}/ship`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error shipping order:', error);
            throw error;
        }
    },

    // Deliver order
    deliverOrder: async (orderId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${orderId}/deliver`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error delivering order:', error);
            throw error;
        }
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${orderId}/cancel`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error cancelling order:', error);
            throw error;
        }
    },

    // Delete order
    deleteOrder: async (orderId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/${orderId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    },
    // Lấy tất cả đơn hàng đã giao (DELIVERED)
    getDeliveredOrders: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/delivered`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching delivered orders:', error);
            throw error;
        }
    },
    // Xác nhận thanh toán (CONFIRMED_PAYMENT) - API mới
    confirmOrderPayment: async (orderId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${orderId}/confirmed-payment`,
                {},  // body rỗng
                { headers: getAuthHeader() }  // headers đúng vị trí
            );
            return response.data;
        } catch (error) {
            console.error('Error confirming payment:', error);
            throw error;
        }
    },
    // Lấy tất cả đơn hàng đã thanh toán (PAID) với phân trang
    getPaidOrders: async (page = 0, size = 5, sortBy = 'deliveryDate') => {
        try {
            const token = getAuthToken();
            if (!token) {
                console.error('No JWT token found');
                throw new Error('Authentication required');
            }

            const response = await axios.get(`${API_BASE_URL}/paid`, {
                params: { page, size, sortBy },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching paid orders:', error);
            if (error.response?.status === 403) {
                console.error('Access forbidden - check admin role');
            }
            throw error;
        }
    },

}


    ;


export default AdminOrderService;