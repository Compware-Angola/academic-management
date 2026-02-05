import { fetchMotivoIsencaoDropdown, MotivoIsencaoResponse } from "@/services/shared/fetch-motivo-insecao.service";
import { useQuery } from "@tanstack/react-query";

export function useMotivoIsencaoDropdown() {
  return useQuery<MotivoIsencaoResponse[]>({
    queryKey: ["motivo-isencao-dropdown"],
    queryFn: fetchMotivoIsencaoDropdown,
    staleTime: 1000 * 60 * 10,
    retry: 0,
  });
}
