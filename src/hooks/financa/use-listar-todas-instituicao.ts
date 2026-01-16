import { listInstituicao } from "@/services/finance/listar-todas-instituicao.service"
import { useQuery } from "@tanstack/react-query"


export function useListInstituicao() {
  return useQuery({
    queryKey: ["instituicao-todas"],
    queryFn: listInstituicao,
  })
}
