import { useQuery } from "@tanstack/react-query"
import { fetchAcessosPorGrupo, GrupoAcesso } from "@/services/access/fetch-grupo-accesses.service"

export function useQueryAcessosPorGrupo(grupoId?: number) {

  console.log("HOOK ID", grupoId)

  return useQuery<GrupoAcesso[]>({
    queryKey: ["acessos-por-grupo", grupoId],
    queryFn: () => fetchAcessosPorGrupo(grupoId as number),
    enabled: !!grupoId
  })
}
