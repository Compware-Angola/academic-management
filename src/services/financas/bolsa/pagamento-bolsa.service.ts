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
  apenasSemPagamento?: number;
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

export type PagamentoBolsaEstudantesResponse = {
  bolsa: {
    codigo: number;
    designacao: string;
    instituicao: string | null;
  };
  data: {
    codigo_bolseiro: number;
    codigo_matricula: number;
    nome: string;
    bi: string;
    curso: string;
    ano_lectivo: string;
    semestre: number;
    status_bolseiro: number;
    desconto: number;
    data_inicio_bolsa: string;
    data_fim_bolsa: string;
    isentar_multa: string;
    created_at: string;
  }[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
export interface ListarPagamentoBolsaEstudantesParams {
  codigoBolsa: number;
  codigoInstituicao?: number;
  anoLectivo?: number;
  semestre?: number;
}

export async function listarPagamentoBolsaEstudantes(
  params?: ListarPagamentoBolsaEstudantesParams,
) {
  const { codigoBolsa, codigoInstituicao, anoLectivo, semestre } = params || {};
  const q = new URLSearchParams();

  if (codigoInstituicao) q.append("codigoInstituicao", codigoInstituicao.toString());
  if (anoLectivo) q.append("anoLectivo", anoLectivo.toString());
  if (semestre) q.append("semestre", semestre.toString());

  const response = await axiosNestFinance.get<PagamentoBolsaEstudantesResponse>(
    `/pagamentos-bolsa/bolsa/${codigoBolsa}/estudantes`,
    {
      params: q,
    },
  );
  return response.data;
}

export interface ListarPagamentoBolsaConciliacaoResumoParams {
  anoLectivo?: number;
  semestre?: number;
}
export type PagamentoBolsaConciliacaoResumoResponse = {
  data: {
    codigo_instituicao: number;
    instituicao: string;
    qtd_bolsas: number;
    qtd_bolseiros: number;
    tipo_desconto_sigla: string;
    mensalidade_media: number;
    valor_depositado: number;
    valor_esperado: number;
    diferenca: number;
    pct_divergencia: number;
    status_conciliacao: string;
  }[];

};
export async function listarPagamentoBolsaConciliacaoResumo(
  params?: ListarPagamentoBolsaConciliacaoResumoParams,
) {
  const { anoLectivo, semestre } = params || {};
  const q = new URLSearchParams();

  if (anoLectivo) q.append("anoLectivo", anoLectivo.toString());
  if (semestre) q.append("semestre", semestre.toString());

  const response = await axiosNestFinance.get<PagamentoBolsaConciliacaoResumoResponse>(
    `/pagamentos-bolsa/conciliacao/resumo`,
    {
      params: q,
    },
  );
  return response.data;
}


export interface ListarPagamentoBolsaConciliacaoInsightsParams {
  anoLectivo: number;
  semestre?: number;
}
export type PagamentoBolsaConciliacaoInsightsResponse = {
  instituicaoMaiorValor: {
    nome: string;
    valor: number;
  };
  instituicaoMaisBolseiros: {
    nome: string;
    qtd: number;
  };
  divergenciasFinanceiras: {
    label: string;
    descricao: string;
    valor: number;
  };
  crescimentoVsPeriodoAnterior: {
    label: string;
    descricao: string;
    valor: number;
  };
  tendenciaCustos: {
    label: string;
    descricao: string;
  };
  saudeConciliacao: {
    label: string;
    descricao: string;
    valor: number;
  };
  totais: {
    totalDepositado: number;
    totalEsperado: number;
    diferenca: number;
    totalBolseiros: number;
    semPagamento: number;
    totalInstituicoes: number;
  };
};


export async function listarPagamentoBolsaConciliacaoInsights(
  params?: ListarPagamentoBolsaConciliacaoInsightsParams,
) {
  const { anoLectivo, semestre } = params || {};
  const q = new URLSearchParams();

  if (anoLectivo) q.append("anoLectivo", anoLectivo.toString());
  if (semestre) q.append("semestre", semestre.toString());

  const response = await axiosNestFinance.get<PagamentoBolsaConciliacaoInsightsResponse>(
    `/pagamentos-bolsa/conciliacao/insights`,
    {
      params: q,
    },
  );
  return response.data;
}