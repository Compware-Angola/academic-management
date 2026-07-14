// utils/filters.ts

// Valor que representa "Todos" na camada de apresentação (state/UI)
export const ALL_VALUE = "all";

type AllValueMap = {
  nest?: string | number;
  apex?: string | number;
};

/**
 * Converte o valor "all" pro formato esperado por cada API.
 * Se o valor não for "all", retorna ele como está.
 */
export function resolveAllValue(
  value: string | number | undefined,
  target: "nest" | "apex",
  map: AllValueMap = { nest: 0, apex: "all" },
) {
  if (value === ALL_VALUE) return map[target];
  return value;
}
