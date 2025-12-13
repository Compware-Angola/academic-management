import {
  GetRegistrationDetailsBySchedulePayload,
  GetRegistrationDetailsByScheduleResponse,
  getRegistrationDetailsByScheduleService,
} from "@/services/horario/fetch-schedule-inscription-details.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryRegistrationDetailsBySchedule = (
  filters: GetRegistrationDetailsBySchedulePayload,
  options?: {
    enabled?: boolean; // permite sobrescrever o comportamento automático
  }
) => {
  const { scheduleId } = filters;

  // Apenas scheduleId é obrigatório
  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : !!scheduleId;

  return useQuery<GetRegistrationDetailsByScheduleResponse>({
    queryKey: [
      "registration-details-by-schedule",
      {
        scheduleId,
      },
    ],
    queryFn: () => getRegistrationDetailsByScheduleService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
