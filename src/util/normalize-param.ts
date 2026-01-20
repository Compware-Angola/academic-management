export function normalizeParam<T>(value: T | undefined | null) {
  return value === undefined || value === null || value === ""
    ? undefined
    : value;
}
