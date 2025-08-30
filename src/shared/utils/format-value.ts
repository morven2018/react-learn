const formatValue = (
  value: number | null | undefined | string,
  isYear: boolean = false
): string => {
  if (value === null || value === undefined || typeof value === 'string')
    return 'N/A';
  if (isYear) return value.toString();
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toFixed(2);
};

export default formatValue;
