import {
  GetHistoryNoteReleasePayload,
  GetHistoryNoteReleaseResponse,
  getHistoryNoteReleaseService,
} from "@/services/avaliacao/fecth-launch-historic";
import { useQuery } from "@tanstack/react-query";

export const useQueryHistoryNoteRelease = (
  filters: GetHistoryNoteReleasePayload,
  options?: {
    enabled?: boolean; // permite sobrescrever o enabled automático
  }
) => {
  const { codigoAnoLectivo, codigoMatricula, codigo_grade_curricular_aluno } =
    filters;

  // Só faz a chamada se os campos obrigatórios estiverem preenchidos
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled
      : !!codigoAnoLectivo &&
        !!codigoMatricula &&
        !!codigo_grade_curricular_aluno;

  return useQuery<GetHistoryNoteReleaseResponse>({
    queryKey: [
      "history-note-release",
      { codigoAnoLectivo, codigoMatricula, codigo_grade_curricular_aluno },
    ],
    queryFn: () => getHistoryNoteReleaseService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
