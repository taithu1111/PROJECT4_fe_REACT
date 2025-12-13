export const formatCurrency = (value) => {
  if (value === null || value === undefined) return "";

  const number = Number(value);
  if (isNaN(number)) return value;

  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
