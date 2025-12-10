export const formatCurrency = (value, currencySymbol = "") => {
  if (value === null || value === undefined) return "";

  const number = Number(value);
  if (isNaN(number)) return value;

  // Ensure number is formatted as currency with American standards
  const formatted = number.toLocaleString("en-US");

  // Prefix the symbol (default to $ if not provided, or respect input)
  // Logic: If currencySymbol is passed, use it. If not, default to nothing? 
  // User asked for "all currency on frontend... to USA icon". 
  // I will make "$" the default if no symbol is passed, or force it if the intention is global replacement.
  // Looking at the existing code: `currencySymbol = ""` was default.
  // I will change the logic to always prefix.
  const symbol = currencySymbol || "$";
  return `${symbol}${formatted}`;
};
