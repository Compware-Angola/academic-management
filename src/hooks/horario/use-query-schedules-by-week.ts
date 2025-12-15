
import { GetSchedulesByDayOfWeekPayload, GetSchedulesByDayOfWeekResponse, getSchedulesByDayOfWeekService } from "@/services/horario/schedule.week.service";
import { useQuery } from "@tanstack/react-query";

export const useQuerySchedulesByDayOfWeek = (
  filters: GetSchedulesByDayOfWeekPayload,
  options?: {
    enabled?: boolean; 
  }
) => {
  const {
    anoLectivo,
    semestre,
    anoCurricular,
    diaSemana,
    periodo,
    curso,
    unidadeCurricular,
    page = 1,
    limit = 25,
  } = filters;

  // Só faz a chamada se TODOS os campos obrigatórios estiverem preenchidos
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled
      : !!anoLectivo &&
        !!semestre &&
        !!anoCurricular &&
        !!diaSemana &&
        !!periodo &&
        !!curso &&
        !!unidadeCurricular;

  return useQuery<GetSchedulesByDayOfWeekResponse>({
    queryKey: [
      "schedules-by-day-of-week",
      {
        anoLectivo,
        semestre,
        anoCurricular,
        diaSemana,
        periodo,
        curso,
        unidadeCurricular,
        page,
        limit,
      },
    ],
    queryFn: () => getSchedulesByDayOfWeekService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30,    // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
