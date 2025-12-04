// src/admin/api/AdminCategoryService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin/categories';

const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminCategoryService = {
    // Get all categories
    getAllCategories: async () => {
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: getAuthHeader()
            });
            console.log('Fetched categories:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Create category
    createCategory: async (categoryData) => {
        try {
            const response = await axios.post(
                API_BASE_URL,
                categoryData,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    // Update category
    updateCategory: async (categoryId, categoryData) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${categoryId}`,
                categoryData,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    // Delete category
    deleteCategory: async (categoryId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/${categoryId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};

export default AdminCategoryService;