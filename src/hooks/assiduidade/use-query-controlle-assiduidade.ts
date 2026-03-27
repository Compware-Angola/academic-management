import { GetAttendanceControleResponse, GetAttendanceControllingPayload, getAttendanceControllingService } from "@/services/assiduidade/fetch-controle-assiduidade.service";
import { useQuery } from "@tanstack/react-query";


export const useQueryControleAttendance = (
  payload: GetAttendanceControllingPayload,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true;

  return useQuery<GetAttendanceControleResponse>({
    queryKey: ["schedules-by-docente", payload],
    queryFn: () => getAttendanceControllingService(payload),
    enabled:
      enabled &&
      !!payload.docenteId &&
      !!payload.anoLectivo &&
      !!payload.semestre &&
      !!payload.data_inicio &&
      !!payload.data_fim &&
      !!payload.estado_aula,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
};