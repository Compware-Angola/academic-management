import { useQuery } from "@tanstack/react-query"
import { fetchAcessosPorGrupo, GrupoAcesso } from "@/services/access/fetch-grupo-accesses.service"

export function useQueryAcessosPorGrupo(grupoId?: number) {



  return useQuery<GrupoAcesso[]>({
    queryKey: ["acessos-por-grupo", grupoId],
    queryFn: () => fetchAcessosPorGrupo(grupoId as number),
    enabled: !!grupoId
  })
}
