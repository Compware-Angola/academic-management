export function formatNumber(
  value: number | string,
  decimals: number = 2
): string {
  const num = Number(value);
  if (isNaN(num)) return "";

  return new Intl.NumberFormat("pt-AO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
