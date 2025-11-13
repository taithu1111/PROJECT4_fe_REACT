// src/api/APIProduct.js
import axios from "axios";

export const API_BASE_URL = "http://localhost:8080"; // Base URL chung

const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt"); // Lấy token từ localStorage
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const APIProduct = {
    // Lấy tất cả sản phẩm
    getAllProducts: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/product`, {
                headers: getAuthHeaders(),
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error("Error fetching all products:", error);
            return [];
        }
    },

    // Lấy sản phẩm theo filter (pagination)
    getProductsByFilter: async ({
        category,
        color = [],
        minPrice,
        maxPrice,
        sort,
        pageNumber = 0,
        pageSize = 10,
    }) => {
        try {
            const params = { pageNumber, pageSize };
            if (category) params.category = category;
            if (color.length > 0) params.color = color;
            if (minPrice !== undefined) params.minPrice = minPrice;
            if (maxPrice !== undefined) params.maxPrice = maxPrice;
            if (sort) params.sort = sort;

            const response = await axios.get(`${API_BASE_URL}/api/product/filter`, {
                headers: getAuthHeaders(),
                params,
            });

            // Backend trả về Page<ProductDTO>, trích xuất content
            return Array.isArray(response.data)
                ? response.data
                : response.data?.content || [];
        } catch (error) {
            console.error("Error fetching filtered products:", error);
            return [];
        }
    },

    // Sản phẩm mới
    getNewProducts: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/product/new`, {
                headers: getAuthHeaders(),
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error("Error fetching new products:", error);
            return [];
        }
    },

    getRandomProducts: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/product/random`, {
                headers: getAuthHeaders(),
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error("Error fetching random products:", error);
            return [];
        }
    },
};

export default APIProduct;
