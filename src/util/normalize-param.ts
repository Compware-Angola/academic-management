export function normalizeParam<T>(value: T) {
  return value === 0 ? undefined : value;
}
