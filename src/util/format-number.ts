export function formatNumber(
  value: number | string,
  decimals: number = 2,
): string {
  const num = Number(value);
  if (isNaN(num)) return "";

  return new Intl.NumberFormat("pt-AO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatNumberMilhares(
  value: number | string,
  decimals: number = 2,
): string {
  const normalized =
    typeof value === "string"
      ? value.replace(/\./g, "").replace(",", ".")
      : value;

  const num = Number(normalized);

  if (isNaN(num)) return "";

  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
