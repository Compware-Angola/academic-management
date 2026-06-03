import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type ListPagamentosMensaisPayload = {
  codigoAnoLectivo: number;
  codigoCurso: number;

  codigoPagamento?: number;
  codigoFaculdade?: number;
  codigoMatricula?: number;
  codigoPeriodo?: number;
  mesId?: number;
  nome?: string;

  page?: number;
  limit?: number;
};

export type PagamentoMensalItem = {
  codigofactura: number;
  codigopagamento: number;
  codigomatricula: number;
  nomecompleto: string;
  faculdade: string;
  curso: string;
  periodo: string;
  valormensalidade: number;
  anolectivo: string;
  mes: string;
  tipo: string;
};

export type ListPagamentosMensaisResponse = {
  data: PagamentoMensalItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListPagamentosMensaisService(
  payload: ListPagamentosMensaisPayload,
): Promise<ListPagamentosMensaisResponse> {
  const { data } = await axiosNestFinance.get<ListPagamentosMensaisResponse>(
    "/payment/monthly",
    {
      params: {
        ...payload,
        page: payload.page ?? 1,
        limit: payload.limit ?? 20,
      },
    },
  );

  return data;
}


export type RecalculatePaymentsResponse = {
  success: boolean;
  totais: {
    totalpreco: number;
    desconto: number;
    totalmulta: number;
    valorapagar: number;
    valorentregue: number;
  };
  message: string;
};
export async function recalculatePaymentsService(
  codFactura: number,
): Promise<RecalculatePaymentsResponse> {
  const { data } = await axiosNestFinance.patch(
    `financial/monthly-fees/recalculate-payments/${codFactura}`,
  );

  return data;
}


