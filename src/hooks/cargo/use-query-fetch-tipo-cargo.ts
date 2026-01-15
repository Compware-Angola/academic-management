import { fetchTipoCargo, Cargo } from "@/services/tipo-cargos/fetch-tipo-cargo";
import { useQuery } from "@tanstack/react-query";

export function useQueryFetchTipoCargo() {
  return useQuery<Cargo[], Error>({
    queryKey: ["tipo-cargo"],
    queryFn: fetchTipoCargo,
    staleTime: 5 * 60 * 1000,
  });
}
