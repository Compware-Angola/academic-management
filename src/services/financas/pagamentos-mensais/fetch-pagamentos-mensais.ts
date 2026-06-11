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

export type ExportPagamentosMensaisPayload = Omit<
  ListPagamentosMensaisPayload,
  "page" | "limit"
>;

export type ExportPagamentosMensaisResponse = {
  blob: Blob;
  fileName: string;
};

type ExportFormat = "csv" | "pdf";

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

export async function exportPagamentosMensaisService(
  payload: ExportPagamentosMensaisPayload,
  format: ExportFormat = "csv",
): Promise<ExportPagamentosMensaisResponse> {
  const endpoint =
    format === "pdf"
      ? "/payment/monthly/export/pdf"
      : "/payment/monthly/export";
  const response = await axiosNestFinance.get<Blob>(endpoint, {
    params: payload,
    responseType: "blob",
  });

  const contentDisposition = response.headers["content-disposition"] as
    | string
    | undefined;
  const fileNameMatch = contentDisposition?.match(
    /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i,
  );
  const fallbackFileName = `mensalidades-pagas-${new Date()
    .toISOString()
    .slice(0, 10)}.${format}`;

  return {
    blob: response.data,
    fileName: fileNameMatch
      ? decodeURIComponent(fileNameMatch[1])
      : fallbackFileName,
  };
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
