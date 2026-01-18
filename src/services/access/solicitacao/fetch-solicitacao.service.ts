// src/services/solicitacao/listar-solicitacoes.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";
import { normalizeParam } from "@/util/normalize-param";

export type ListarSolicitacoesPayload = {
  serviceId?: number | string;
  estado?: string;
  page?: number;
  limit?: number;
};

/* ---------- RESPONSE ITEM ---------- */
export type Solicitacao = {
  codigo: number;
  arquivo: string;
  estado_encaminhamento: number;
  prioridade: string;
  nome_remetente: string;
  nome_receptor: string;
  codigo_matricula: number;
  codigo_solicitacao: number;
  descricao: string | null;
  assunto: string;
  data_solicitacao: string;
  destino: string;
  nome: string;
  descricao_servico: string;
  curso: string;
  estado_aprovacao: string;
  estado: string;
};

/* ---------- RESPONSE COMPLETO ---------- */
export type ListarSolicitacoesResponse = {
  data: Solicitacao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function listarSolicitacoesService(
  payload: ListarSolicitacoesPayload
): Promise<ListarSolicitacoesResponse> {
  const {
    serviceId,
    estado,
    page = 1,
    limit = 10,
  } = payload;

  const params = {
    serviceId: normalizeParam(serviceId),
    estado: normalizeParam(estado),
    page,
    limit,
  };

  const { data } = await axiosNestGa.get<ListarSolicitacoesResponse>(
    "/solicitacoa/solicitacoes",
    { params }
  );

  return data;
}