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
  codigo_pagamento: string | null;
  ano_lectivo: string;
  semestre: string | null;
  valor_depositado: number;
  data_deposito: string;
  referencia: string | null;
  observacao: string | null;
  estado_pagamento: string | null;
  data_registo: string | null;
  qtd_estudantes: number;
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
