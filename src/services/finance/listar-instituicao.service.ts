// services/financa/list-instituicao-tipo.service.ts

import { axiosApexGa } from "@/lib/axios-apex-ga";

/**
 * Formato bruto vindo da API (ORDS)
 */
interface InstituicaoTipoApi {
  codigo: number;
  designacao: string;
  descricao: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Resposta padrão do ORDS
 */
interface ListInstituicaoTipoApiResponse {
  items: InstituicaoTipoApi[];
}

/**
 * Modelo que o frontend consome
 */
export interface InstituicaoTipo {
  id: number;
  nome: string;
}

/**
 * Lista os tipos de instituição (com normalização)
 */
export async function listInstituicaoTipo(): Promise<InstituicaoTipo[]> {
  const { data } = await axiosApexGa.get<ListInstituicaoTipoApiResponse>(
    "/financa/instituicao/tipo",
  );

  return data.items.map((item) => ({
    id: item.codigo,
    nome: item.designacao,
  }));
}
