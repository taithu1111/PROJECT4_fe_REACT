export const formatCurrency = (value, showCurrency = false) => {
    if (value === null || value === undefined) return "";

    // Ép về số
    const number = Number(value);

    if (isNaN(number)) return value;

    // Format theo chuẩn VN
    const formatted = number.toLocaleString("vi-VN");

    return showCurrency ? `${formatted} ₫` : formatted;
};
