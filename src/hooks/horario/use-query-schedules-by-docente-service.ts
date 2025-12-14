
import { GetSchedulesByDocentePayload, GetSchedulesByDocenteResponse, getSchedulesByDocenteService } from "@/services/horario/fetch-schedule-by-docente.service";
import { useQuery } from "@tanstack/react-query";


export const useQuerySchedulesByDocente = (
  payload: GetSchedulesByDocentePayload,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true;

  return useQuery<GetSchedulesByDocenteResponse>({
    queryKey: ["schedules-by-docente", payload],
    queryFn: () => getSchedulesByDocenteService(payload),
    enabled:
      enabled &&
      !!payload.docenteId &&
      !!payload.anoLectivo &&
      !!payload.semestre &&
      !!payload.periodo,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
};