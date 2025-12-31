import {
  GetMonthlyInstallmentsPayload,
  GetMonthlyInstallmentsResponse,
  getMonthlyInstallmentsService,
} from "@/services/avaliacao/fetch-monthly-installments.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryMonthlyInstallments = (
  filters: GetMonthlyInstallmentsPayload,
  options?: {
    enabled?: boolean;
  }
) => {
  const { semestre, anoLectivo } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : !!anoLectivo;

  return useQuery<GetMonthlyInstallmentsResponse>({
    queryKey: ["monthly-installments", { semestre, anoLectivo }],
    queryFn: () => getMonthlyInstallmentsService(filters),
    enabled,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
