import { axiosApexGa } from "@/lib/axios-apex-ga"
import { axiosNestGa } from "@/lib/axios-nest-ga"

/**
 * Instituição (payload real da API)
 */
export interface Instituicao {
  codigo: number
  instituicao: string
  nif: string
  contacto: string | null
  endereco: string | null
  sigla: string | null
  tipo_instituicao: number
}

/**
 * Response da API
 */
export interface ListInstituicaoResponse {
  items: Instituicao[]
  first?: {
    $ref: string
  }
}

/**
 * Service
 */
export async function listInstituicao(): Promise<ListInstituicaoResponse> {
  const { data } = await axiosApexGa.get("/financa/instituicao")

  return data
}
