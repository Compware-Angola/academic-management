export const parseFilter = (v?: string) => {
  if (!v || v === "all") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};

export const parseDateFilter = (v?: string) => {
  if (!v || v.trimEnd() == "") return undefined;
  return v;
};
