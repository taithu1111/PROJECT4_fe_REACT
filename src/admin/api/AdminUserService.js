// src/api/AdminUserService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin/users';

// Get JWT token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminUserService = {
    // Get all users with pagination
    getAllUsers: async (page = 0, size = 10, sortBy = null) => {
        try {
            const params = { page, size };
            if (sortBy) params.sortBy = sortBy;

            const response = await axios.get(`${API_BASE_URL}/`, {
                params,
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Toggle user status (active/inactive)
    toggleUserStatus: async (userId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${userId}/status`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error toggling user status:', error);
            throw error;
        }
    }
};

export default AdminUserService;