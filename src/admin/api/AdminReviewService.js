// src/admin/api/AdminReviewService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin/reviews';

const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminReviewService = {
    // Get all reviews with pagination and filters
    getAllReviews: async (productId = null, userId = null, page = 0, size = 10) => {
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
            console.error('Error fetching reviews:', error);
            throw error;
        }
    },

    // Get review by ID
    getReviewById: async (reviewId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${reviewId}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching review:', error);
            throw error;
        }
    },

    // Update review
    updateReview: async (reviewId, reviewText) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${reviewId}`,
                { review: reviewText },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    },

    // Delete review
    deleteReview: async (reviewId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/${reviewId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }
};

export default AdminReviewService;