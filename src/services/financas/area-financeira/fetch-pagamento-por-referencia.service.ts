import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type ObterReferenciasPagamentoPayload = {
  dataInicio?: string;
  dataFinal?: string;
  codigoproduto?: number;
  status?: string;
  codigoFactura?: number;
  codigoMatricula?: number;
  reference?: string;
  anoLectivo?: number;
  page?: number;
  limit?: number;
};

export type ReferenciasPagamentoItem = {
  codigo_matricula: number;
  nome: string;
  contacto: string;
  codigo_factura: number;
  entidade: string;
  referencia: string;
  preco: number;
  data_inicio: string;
  data_final: string;
  estado: string;
  data_pagamento: string | null;
  curso: string;
  servico_descricao: string;
  polo: string;
  rn: number;
};

export type ObterReferenciasPagamentoResponse = {
  data: ReferenciasPagamentoItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getPaymentReferencesService(
  payload: ObterReferenciasPagamentoPayload,
): Promise<ObterReferenciasPagamentoResponse> {
  const {
    dataInicio,
    dataFinal,
    codigoproduto,
    status,
    codigoFactura,
    codigoMatricula,
    reference,
    anoLectivo,
    page = 1,
    limit = 10,
  } = payload;

  console.log("payload", payload);

  const { data } =
    await axiosNestFinance.get<ObterReferenciasPagamentoResponse>(
      "/payment-references/list",
      {
        params: {
          dataInicio,
          dataFinal,
          codigoproduto,
          status,
          codigoFactura,
          codigoMatricula,
          reference,
          anoLectivo,
          page,
          limit,
        },
      },
    );

  return data;
}
