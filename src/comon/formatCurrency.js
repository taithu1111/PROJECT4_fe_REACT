export const formatCurrency = (value, currencySymbol = "") => {
  if (value === null || value === undefined) return "";

  const number = Number(value);
  if (isNaN(number)) return value;

  const formatted = number.toLocaleString("en-US"); // or "vi-VN" if you want Vietnamese format

  return currencySymbol ? `${formatted} ${currencySymbol}` : formatted;
};
