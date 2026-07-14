import { axiosNestFinance } from "@/lib/axios-nest-finance";
import { normalizeParam } from "@/util/normalize-param";

export type ListarFacturasPayload = {
  search?: string | number;
  codigoMatricula?: string | number;
  reference?: string | number;
  codigoFatura?: string | number;
  biEstudante?: string;
  anoLectivo?: number | string;
  status?: number | null | string;
  page?: number;
  limit?: number;
};

/* ---------- RESPONSE ITEM ---------- */
export type Factura = {
  codigo: number;
  valor_pagar: number;
  desconto?: number;
  data_factura: string;
  data_pagamento: string | null;
  total_multa: number;
  total_iva: number;
  total_incidencia: number;
  total_preco: number;
  codigo_matricula: number;
  referencia: string;
  descricao: string;
  estado: number;
  nome_aluno: string;
  bi_aluno: string;
  ano_lectivo: string;
  servicos: string;
  n_operacao_bancaria: string;
  n_operacao_bancaria2: string;
  codigo_ano_lectivo?: number;

  curso: string;
  polo: string;
  rn: number;
  motivo_anulacao: string | null;
  data_anulacao: string | null;
  utilizador_anulacao: string | null;
  cadeiras_recurso_epoca_especial?: string | null;
  caixa: string | null;
  tipo_pagamento: string | null;
  data_banco: string | null;
  nome_utilizador_pagamento: string | null;
  forma_pagamento: string | null;
};

/* ---------- RESPONSE ITEM ---------- */
export type FacturaDetalhe = {
  Codigo: number;
  DataFactura: string;
  TotalPreco: number;
  CodigoMatricula: number;
  Referencia: string;
  Desconto: number;
  Troco: number | null;
  totalIVA: number;
  TotalMulta: number;
  totalIncidencia: number | null;
  totalRetencao: number | null;
  ValorAPagar: number;
  ValorEntregue: number | null;
  ValorAPagarExtenso: string | null;
  Descricao: string;
  ValorEntregueMltCX: number;
  codigoDescricao: number;
  NextFactura: string | null;
  next: string | null;
  textoHash: string;
  dataVencimento: string;
  poloId: number;
  obs: string | null;
  hashValor: string;
  contaCorrente: string | null;
  faturaReference: string | null;
  canal: number;
  anoLectivo: number;
  estado: number;
  corrente: number;
  codigoPreinscricao: number;
  numSequenciaFactura: number;
  tipoDocumentoFacturaId: number;
};

/* ---------- RESPONSE COMPLETO ---------- */
export type ListarFacturasResponse = {
  data: Factura[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function listarFacturasService(
  payload: ListarFacturasPayload,
): Promise<ListarFacturasResponse> {
  const {
    search,
    anoLectivo,
    page = 1,
    limit = 25,
    status,
    codigoMatricula,
    reference,
    codigoFatura,
    biEstudante,
  } = payload;

  const params = {
    search: normalizeParam(search),
    anoLectivo: normalizeParam(anoLectivo),
    codigoMatricula: normalizeParam(codigoMatricula),
    reference: normalizeParam(reference),
    status: normalizeParam(status),
    codigoFatura: normalizeParam(codigoFatura),
    biEstudante: normalizeParam(biEstudante),
    page,
    limit,
  };

  const { data } = await axiosNestFinance.get<ListarFacturasResponse>(
    "/invoices",
    { params },
  );

  return data;
}

/* ---------- RESPONSE ITEM ---------- */
export type FacturaItem = {
  codigoitem: number;
  codigofactura: number;
  codigoproduto: number;
  quantidade: number;
  obs: string | null;
  preco: number;
  total: number;
  multa: number;
  descricaoservico: string;
  codigoservico: number;
  mesid: number | null;
  mesdescricao: string | null;
  prestacao: number | null;
};

/* ---------- RESPONSE PADRÃO API ---------- */
export type ListarFacturaItensResponse = {
  statusCode: number;
  message: string;
  data: FacturaItem[];
};

/* ---------- SERVICE ---------- */
export async function listarFacturaItensService(
  facturaId: number | string,
): Promise<ListarFacturaItensResponse> {
  const { data } = await axiosNestFinance.get<ListarFacturaItensResponse>(
    `/invoices/${facturaId}/itens`,
  );

  return data;
}
export async function buscarFacturaService(
  facturaId: number | string,
): Promise<FacturaDetalhe> {
  console.log(facturaId);
  const { data } = await axiosNestFinance.get<FacturaDetalhe>(
    `/invoices/${facturaId}`,
  );

  return data;
}

export async function annulInvoiceService(params: {
  facturaId: number | string;
  motivo: string;
}): Promise<{ sucesso: boolean; mensagem: string }> {
  const { facturaId, motivo } = params;
  const { data } = await axiosNestFinance.delete(`/invoices/${facturaId}`, {
    data: { motivo },
  });

  return data;
}

export async function reactivateInvoiceService(
  facturaId: number | string,
): Promise<FacturaDetalhe> {
  const { data } = await axiosNestFinance.patch(
    `/invoices/reactivate/${facturaId}`,
  );
  return data;
}
