export const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt");
    return token ? { Authorization: `Bearer ${token}` } : {};
};