import {
  GetRegistrationBySchedulePayload,
  GetRegistrationByScheduleResponse,
  getRegistrationByScheduleService,
} from "@/services/horario/fetch-schedule-inscription.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryRegistrationBySchedule = (
  filters: GetRegistrationBySchedulePayload,
  options?: {
    enabled?: boolean; // permite sobrescrever o comportamento automático
  }
) => {
  const {
    anoLectivo,
    semestre,
    periodo,
    curso,
    anoCurricular,
    unidadeCurricular,
    afetacaoDocente,
    estado,
    page = 1,
    limit = 25,
  } = filters;

  // Apenas anoLectivo é obrigatório
  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : !!anoLectivo;

  return useQuery<GetRegistrationByScheduleResponse>({
    queryKey: [
      "registration-by-schedule",
      {
        anoLectivo,
        semestre,
        periodo,
        curso,
        anoCurricular,
        unidadeCurricular,
        afetacaoDocente,
        estado,
        page,
        limit,
      },
    ],
    queryFn: () => getRegistrationByScheduleService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
