// src/services/solicitacao/listar-solicitacoes.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";
import { normalizeParam } from "@/util/normalize-param";


/* ---------- RESPONSE ITEM ---------- */
export type Avisos = {
  CODIGO: number;
  ASSUNTO: string;
  DESCRICAO: string;
  DATE_EXPIRACAO: string;
  NOME: string;
  CURSO: string;
  PERIODO: string;
  DESTINO: string;
  STATUS_: number;
};

/* ---------- RESPONSE COMPLETO ---------- */
export type AvisosResponse = {
  data: Avisos[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function AvisosService({
  page,
  limit,
  assunto
}: {
    page: number;
  limit: number;
  assunto?: string;
  }): Promise<AvisosResponse> {
  
    const { data } = await axiosNestGa.get<AvisosResponse>(
    "/solicitacoa/avisos",
         {
      params: {
        page,
        limit,
        assunto: normalizeParam(assunto),
      },
    }
);

    //console.log("RESPOSTA BACKEND:", data);

  return data;
}