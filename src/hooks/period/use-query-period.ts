import { fetchPeriodo,Periodo } from "@/services/period/fetch-period";
import { useQuery } from "@tanstack/react-query";

export function useQueryPeriod() {
  return useQuery<Periodo[]>({
    queryKey: ["period"],
    queryFn: fetchPeriodo,
    staleTime: 1 * 60 * 60 * 1000,
  });
}
