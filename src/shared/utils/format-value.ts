const formatValue = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toFixed(2);
};
export default formatValue;
