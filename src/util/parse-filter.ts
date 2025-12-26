export const parseFilter = (v?: string) => {
  if (!v || v === "all") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};
