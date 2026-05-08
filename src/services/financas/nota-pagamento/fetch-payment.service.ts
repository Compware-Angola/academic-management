import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type ListPaymentsPayload = {
  anoLectivo: number;
  codigoMatricula?: number;
  codigoFactura?: number;
  n_operacao_bancaria?: number;
  n_operacao_bancaria2?: number;
  estado?: number;
  nome?: string;
  page?: number;
  limit?: number;
};

export type PaymentItem = {
  codigo_pagamento: number;
  data_registro: string;
  canal?: string;
  operacao_bancaria: string;
  nome_operador: string;
  seg_operacao_bancaria: string | null;
  anolectivo: number;
  totalgeral: number | null;
  databanco: string;
  forma_pagamento: string;
  valor_depositado: number;
  conta_movimentada: number;
  estado_pagamento: number;
  tipo_pagamento: string;
  status_pagamento: string;
  data_actualizacao: string;
  data_operacao: string;
  caixa?: string;
  nome_completo: string;
  codigo_matricula: number;
  curso: string;
  codigo_factura: number;
};

export type ListPaymentsResponse = {
  data: PaymentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListPaymentsService(
  payload: ListPaymentsPayload,
): Promise<ListPaymentsResponse> {
  const {
    anoLectivo,
    codigoMatricula,
    codigoFactura,
    n_operacao_bancaria,
    n_operacao_bancaria2,
    estado,
    nome,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestFinance.get<ListPaymentsResponse>(
    "/payment/list-payments",
    {
      params: {
        anoLectivo,
        codigoMatricula,
        codigoFactura,
        n_operacao_bancaria,
        n_operacao_bancaria2,
        estado,
        nome,
        page,
        limit,
      },
    },
  );

  return data;
}
