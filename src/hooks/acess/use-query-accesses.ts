import { AccessesPaginatedResponse, fetchAccesses, FetchAcessosParams } from "@/services/access/fecth-accesses.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryAccesses(params?: FetchAcessosParams) {
  return useQuery<AccessesPaginatedResponse>({
    queryKey: ["accesses", params],
    queryFn: () => fetchAccesses(params),
    enabled: !!params,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
