// src/services/solicitacao/listar-solicitacoes.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";
import { normalizeParam } from "@/util/normalize-param";


/* ---------- RESPONSE ITEM ---------- */
export type Solicitacao = {
  name: string;
  descricao_servico: string;
  matricula: number;
  data_solicitacao: string;
  curso: string;
  estado_aprovacao: string;
};

/* ---------- RESPONSE COMPLETO ---------- */
export type ListarAllSolicitacoesResponse = {
  data: Solicitacao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function listarAllSolicitacoesService({ page,
  limit,}: {
    page: number;
  limit: number;
  }): Promise<ListarAllSolicitacoesResponse> {
  
    const { data } = await axiosNestGa.get<ListarAllSolicitacoesResponse>(
    "/solicitacoa/all-solicitacoes",
         {
      params: {
        page,
        limit,
      },
    }
);

    console.log("RESPOSTA BACKEND:", data);

  return data;
}