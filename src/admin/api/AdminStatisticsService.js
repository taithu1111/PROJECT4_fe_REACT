// src/api/AdminStatisticsService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin/statistics';

const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminStatisticsService = {
    // Get dashboard statistics
    getDashboardStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }
};

export default AdminStatisticsService;