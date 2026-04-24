import { useQuery } from "@tanstack/react-query";
import {
  fetchTiposPergunta,
  fetchDisciplinas,
  TiposPerguntaParams,
  DisciplinasParams,
} from "@/services/access_exam/tipos-disciplinas.service";

// ─────────────────────────────────────────────
// TIPOS DE PERGUNTA
// ─────────────────────────────────────────────

export function useTiposPergunta(
  params?: TiposPerguntaParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["tipos-pergunta", params],
    queryFn: () => fetchTiposPergunta(params),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 10, // 10 min — raramente muda
  });
}

// ─────────────────────────────────────────────
// DISCIPLINAS
// ─────────────────────────────────────────────

export function useDisciplinas(
  params?: DisciplinasParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["disciplinas", params],
    queryFn: () => fetchDisciplinas(params),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 10, // 10 min — raramente muda
  });
}

// ─────────────────────────────────────────────
// HELPERS — listas flat (úteis para selects)
// ─────────────────────────────────────────────

/** Devolve apenas o array data[], sem paginação. Ideal para <Select> */
export function useTiposPerguntaList(options?: { enabled?: boolean }) {
  const query = useTiposPergunta({ page: 1, limit: 100 }, options);
  return {
    ...query,
    data: query.data?.data ?? [],
  };
}

export function useDisciplinasList(options?: { enabled?: boolean }) {
  const query = useDisciplinas({ page: 1, limit: 100 }, options);
  return {
    ...query,
    data: query.data?.data ?? [],
  };
}