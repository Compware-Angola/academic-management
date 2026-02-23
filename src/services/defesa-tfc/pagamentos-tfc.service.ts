import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type PagamentosTFCPayload = {
  anoLectivo?: number;
  curso?: number;
  periodoId?: number;
  status?: number;
  matriculaId?: number;
  nome?: string;
  page?: number;
  limit?: number;
};

export type PagamentoTFCItem = {
  nome: string;
  matricula: number;
  pagamento: number;
  curso: string;
  estado: number;
};

export type PagamentosTFCResponse = {
  data: PagamentoTFCItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getPagamentosTFCService(
  payload: PagamentosTFCPayload,
): Promise<PagamentosTFCResponse> {
  const {
    anoLectivo,
    curso,
    periodoId,
    matriculaId,
    nome,
    status,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestFinance.get<PagamentosTFCResponse>(
    "payment-tfc/payments-tfc",
    {
      params: {
        anoLectivo,
        curso,
        periodoId,
        status,
        page,
        limit,
        matriculaId,
        nome,
      },
    },
  );

  return data;
}
