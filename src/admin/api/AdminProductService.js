// src/api/AdminProductService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin/products';

const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminProductService = {
    getALlProduct: async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/product`, {
                headers: getAuthHeader()
            });
            console.log("Get all product by admin :  ", response.data);
            return response.data;

        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    // Create single product
    createProduct: async (productData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/`,
                productData,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    // Update product
    updateProduct: async (productId, productData) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${productId}`,
                productData,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    // Delete product
    deleteProduct: async (productId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/${productId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    // Create multiple products
    createMultipleProducts: async (productsArray) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/creates`,
                productsArray,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating multiple products:', error);
            throw error;
        }
    }
};

export default AdminProductService;