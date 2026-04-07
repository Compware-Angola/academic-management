import { NoteReleaseApiResponse } from "@/services/featch-note-release";

import {
  fetchNoteReleases,
  fetchNoteSummary,
  NoteRelease,
  NoteSummary,
} from "@/services/featch-note-release";
import { useQuery } from "@tanstack/react-query";

interface UseQueryNoteReleasesParams {
  anoLectivoId: number;
  horarioId: number;
  tipoProvaId: number;
  tipoAvaliacao: number;
  classe: number;
  turno: number;
  search?: string;
  page?: number;
  limit?: number;
}

function isValidId(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    Number.isFinite(value) &&
    value > 0
  );
}

function isValidParams(params: UseQueryNoteReleasesParams): boolean {
  return (
    isValidId(params.anoLectivoId) &&
    isValidId(params.horarioId) &&
    isValidId(params.tipoProvaId) &&
    isValidId(params.tipoAvaliacao) &&
    isValidId(params.classe) &&
    isValidId(params.turno)
  );
}

export function useQueryNoteReleases(params: UseQueryNoteReleasesParams) {
  const isEnabled = isValidParams(params);

  return useQuery<NoteReleaseApiResponse>({
    queryKey: ["note-releases", params],
    queryFn: async () => {
      if (!isValidParams(params)) {
        throw new Error(
          "Parâmetros inválidos para buscar lançamentos de notas.",
        );
      }
      return fetchNoteReleases(params);
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: isEnabled,
  });
}

// ==================== NOVO - HOOK PARA SUMMARY ====================
export function useQueryNoteSummary(params: UseQueryNoteReleasesParams) {
  const isEnabled = isValidParams(params);

  return useQuery<NoteSummary>({
    queryKey: ["note-summary", params],
    queryFn: async () => {
      if (!isValidParams(params)) {
        throw new Error("Parâmetros inválidos para buscar summary das notas.");
      }
      return fetchNoteSummary(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
    enabled: isEnabled,
  });
}
