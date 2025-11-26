// src/admin/api/AdminRatingService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin/ratings';

const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminRatingService = {
    // Get all ratings with pagination and filters
    getAllRatings: async (productId = null, userId = null, page = 0, size = 10) => {
        try {
            const params = { page, size };
            if (productId) params.productId = productId;
            if (userId) params.userId = userId;

            const response = await axios.get(API_BASE_URL, {
                params,
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching ratings:', error);
            throw error;
        }
    },

    // Get rating by ID
    getRatingById: async (ratingId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${ratingId}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching rating:', error);
            throw error;
        }
    },

    // Update rating
    updateRating: async (ratingId, rating) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${ratingId}`,
                { rating },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating rating:', error);
            throw error;
        }
    },

    // Delete rating
    deleteRating: async (ratingId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/${ratingId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting rating:', error);
            throw error;
        }
    }
};

export default AdminRatingService;