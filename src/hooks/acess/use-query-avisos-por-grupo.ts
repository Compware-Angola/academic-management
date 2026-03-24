import { AvisosPorGruposResponse, AvisosPorGruposService } from "@/services/access/solicitacao/fetch-avisos-por-grupo.service";
import { useQuery } from "@tanstack/react-query";

type UseQueryAvisosPorGruposProps = {
  grupoIds?: number[];
};

export function useQueryAvisosPorGrupos({
  grupoIds,
}: UseQueryAvisosPorGruposProps) {
  const grupoIdsValidos =
    grupoIds?.filter(
      (id) => id !== undefined && id !== null && id !== 0
    ) ?? [];

  return useQuery<AvisosPorGruposResponse>({
    queryKey: ["avisos-por-grupos", grupoIdsValidos],
    queryFn: () =>
      AvisosPorGruposService({
        grupoIds: grupoIdsValidos,
      }),
    enabled: grupoIdsValidos.length > 0,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
    refetchOnWindowFocus: true,
    retry: 2,
  });
}