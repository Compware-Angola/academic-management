import { useQuery } from "@tanstack/react-query";
import {
  AvisosPorGrupoResponse,
  AvisosPorGrupoService,
} from "@/services/access/solicitacao/fetch-avisos-por-grupo.service";

type UseQueryAvisosPorGrupoProps = {
  grupoId?: number;
  curso?: number;
  periodo?: number;
};

export function useQueryAvisosPorGrupo({
  grupoId,
  curso,
  periodo,
}: UseQueryAvisosPorGrupoProps) {
  return useQuery<AvisosPorGrupoResponse>({
    queryKey: ["avisos-por-grupo", grupoId, curso, periodo],
    queryFn: () =>
      AvisosPorGrupoService({
        grupoId: grupoId as number,
        curso,
        periodo,
      }),
    enabled: !!grupoId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}