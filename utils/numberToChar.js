export const numberToChar = (num) => {
  const division = Math.floor(num / 26);
  const remainder = Math.floor(num % 26);
  const char = String.fromCharCode(remainder + 97).toUpperCase();
  return division - 1 >= 0 ? numberToChar(division - 1) + char : char;
};
