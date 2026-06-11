import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type PagamentoBolsaResponse = {
  data: PagamentoBolsa[];
  meta: Meta;
};

export type PagamentoBolsa = {
  codigo_bolsa: number;
  bolsa: string;
  codigo_instituicao: number;
  instituicao: string;
  codigo_pagamento: number;
  codigo_ano_letivo: number;
  semestre: number;
  valor_depositado: number;
  data_deposito: string;
  referencia: string;
  observacao: string;
  estado_pagamento: number;
  data_registo: string;
  qtd_estudantes: number;
  ano_letivo?: string;
};

export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
export type ListarPagamentoBolsaParams = {
  codigoBolsa?: number;
  codigoInstituicao?: number;
  anoLectivo?: number;
  semestre?: number;
  page?: number;
  limit?: number;
};

export async function listarPagamentoBolsa(
  params?: ListarPagamentoBolsaParams,
) {
  const {
    codigoBolsa,
    codigoInstituicao,
    anoLectivo,
    semestre,
    page = 1,
    limit = 10,
  } = params || {};
  const q = new URLSearchParams();

  if (codigoBolsa) q.append("codigoBolsa", codigoBolsa.toString());
  if (codigoInstituicao)
    q.append("codigoInstituicao", codigoInstituicao.toString());
  if (anoLectivo) q.append("anoLectivo", anoLectivo.toString());
  if (semestre) q.append("semestre", semestre.toString());
  if (page) q.append("page", page.toString());
  if (limit) q.append("limit", limit.toString());

  const response = await axiosNestFinance.get<PagamentoBolsaResponse>(
    "/pagamentos-bolsa",
    {
      params: q,
    },
  );
  return response.data;
}
export type CriarPagamentoBolsaPayload = {
  codigoBolsa: number;
  anoLectivo: number;
  semestre: number;
  valorDepositado: number;
  dataDeposito: string;
  referencia: string;
  observacao: string;
};
export async function criarPagamentoBolsa(params: CriarPagamentoBolsaPayload) {
  const response = await axiosNestFinance.post<PagamentoBolsa>(
    "/pagamentos-bolsa",
    params,
  );
  return response.data;
}

export type UpdatePagamentoBolsaPayload = {
  codigoPagamento: number;
  codigoBolsa: number;
  anoLectivo: number;
  semestre: number;
  valorDepositado: number;
  dataDeposito: string;
  referencia: string;
  observacao: string;
};

export async function updatePagamentoBolsa(
  params: UpdatePagamentoBolsaPayload,
) {
  const { codigoPagamento, ...data } = params;
  const response = await axiosNestFinance.put<PagamentoBolsa>(
    `/pagamentos-bolsa/${codigoPagamento}`,
    data,
  );
  return response.data;
}

export async function deletePagamentoBolsa(codigoPagamento: number) {
  const response = await axiosNestFinance.delete<PagamentoBolsa>(
    `/pagamentos-bolsa/${codigoPagamento}`,
  );
  return response.data;
}
