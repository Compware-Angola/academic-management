import { axiosNestGa } from "@/lib/axios-nest-ga"

/**
 * Representa um acesso atribuído a um grupo
 */
export type GrupoAcesso = {
  id: number
  designacao: string
  sigla: string
  moduloId: number
  moduloNome: string
  tipoAcesso: string
  ativo: boolean
  dataAtivacao: string
}

/**
 * Busca todos os acessos associados a um grupo específico
 * @param grupoId PK_GRUPO
 */
export async function fetchAcessosPorGrupo(
  grupoId: number
): Promise<GrupoAcesso[]> {

  console.log("SERVICE ID: ", grupoId)

  const response = await axiosNestGa.get<GrupoAcesso[]>(
    `/acess_management/grupo/${grupoId}`
  )

  return response.data
}
