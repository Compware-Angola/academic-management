import {
  ListServicesByYearParams,
  listServicesByYear,
} from "@/services/financas/fetch-list-services-by-year.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryListServicesByYear(
  params: ListServicesByYearParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ["list-services-by-year", params],
    queryFn: () => listServicesByYear(params),
    enabled: enabled && !!params.codigoAnoLectivo && !!params.tipo,
  });
}
