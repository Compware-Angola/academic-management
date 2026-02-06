import { fetchTipoTaxaDropdown, TipoTaxaResponse } from "@/services/shared/fetch-tipo-taxa.service";
import { useQuery } from "@tanstack/react-query";

export function useTipoTaxaDropdown() {
  return useQuery<TipoTaxaResponse[]>({
    queryKey: ["tipo-taxa-dropdown"],
    queryFn: fetchTipoTaxaDropdown,
    staleTime: 1000 * 60 * 10,
    retry: 0,
  });
}
