import {
  fetchSchedule,
  ScheduleParams,
} from "@/services/horario/fetch-schedule.service";
import { useQuery } from "@tanstack/react-query";

export const useScheduleQuery = (params: Partial<ScheduleParams>) => {
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  return useQuery({
    // QueryKey com apenas valores definidos
    queryKey: ["schedule", cleanParams],
    queryFn: () =>
      fetchSchedule({
        anoLectivo: params.anoLectivo,
        afetacaoDocente: params.afetacaoDocente,
        unidadeCurricular: params.unidadeCurricular,
        semestre: params.semestre,
        periodo: params.periodo,
        page: params.page,
        limit: params.limit,
        anoCurricular: params.anoCurricular,
        curso: params.curso,
        estado: params.estado,
      }),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: Boolean(params.anoLectivo),
  });
};
