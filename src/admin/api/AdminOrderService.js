// src/api/AdminOrderService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin/orders';

const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminOrderService = {
    // Get all orders with pagination
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

    // Confirm order
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
    }
};

export default AdminOrderService;