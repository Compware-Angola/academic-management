import {
  EstudantesInscritosQuery,
  getEstudantesInscritosService,
} from "@/services/avaliacao/fetch-estudantes-inscritos";
import { useQuery } from "@tanstack/react-query";

export function useEstudantesInscritos(
  filters: Partial<EstudantesInscritosQuery>,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["estudantes-inscritos", filters],
    queryFn: () =>
      getEstudantesInscritosService({
        anoCurricular: filters.anoCurricular!,
        anoLectivo: filters.anoLectivo!,
        curso: filters.curso!,
        horarioId: filters.horarioId,
        periodo: filters.periodo!,
        semestre: filters.semestre,
        tipoAvaliacao: filters.tipoAvaliacao,
        unidadeCurricular: filters.unidadeCurricular,
        limit: filters.limit,
        page: filters.page,
      }),
    enabled,
  });
}
