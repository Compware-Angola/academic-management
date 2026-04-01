import { FetchHorariosDisponiveisInscritosPorUcParams, fetchHorariosDisponiveisInscritosPorUcService, HorarioDisponivelInscricao } from "@/services/enrollment/fetch-horarios-disponiveis-por-uc.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryHorariosDisponiveisInscritosPorUc(
  params: FetchHorariosDisponiveisInscritosPorUcParams
) {
  return useQuery<HorarioDisponivelInscricao[]>({
    queryKey: [
      "horarios-disponiveis-inscritos-por-uc",
      params.anoLectivo,
      params.curso,
      params.anoCurricular,
      params.semestre,
      params.periodo,
      params.cadeira,
    ],
    queryFn: () => fetchHorariosDisponiveisInscritosPorUcService(params),
    enabled: Boolean(params.cadeira),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}