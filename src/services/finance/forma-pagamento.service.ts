import { axiosNestFinance } from "@/lib/axios-nest-finance";
import { normalizeParam } from "@/util/normalize-param";

export type FormaPagamento = {
  codigo: number;
  descricao: string;
  status: number;
};

export type ListarFormaPagamentoPayload = {
  search?: string;
  status?: number | string;
};

export async function listarFormaPagamentoService(
  payload?: ListarFormaPagamentoPayload,
): Promise<FormaPagamento[]> {
  const params = {
    search: normalizeParam(payload.search),
    status: normalizeParam(payload.status),
  };

  const { data } = await axiosNestFinance.get<FormaPagamento[]>(
    "/forma-pagamento",
    { params },
  );

  return data;
}

export async function criarFormaPagamentoService(
  payload: Partial<FormaPagamento>,
): Promise<FormaPagamento> {
  const { data } = await axiosNestFinance.post<FormaPagamento>(
    "/forma-pagamento",
    payload,
  );

  return data;
}

export async function atualizarFormaPagamentoService(
  codigo: number,
  payload: Partial<FormaPagamento>,
): Promise<FormaPagamento> {
  const { data } = await axiosNestFinance.put<FormaPagamento>(
    `/forma-pagamento/${codigo}`,
    payload,
  );

  return data;
}

export async function toggleStatusFormaPagamentoService(
  codigo: number,
): Promise<FormaPagamento> {
  const { data } = await axiosNestFinance.patch<FormaPagamento>(
    `/forma-pagamento/${codigo}/toggle-status`,
  );

  return data;
}

export async function removerFormaPagamentoService(codigo: number) {
  const { data } = await axiosNestFinance.delete(`/forma-pagamento/${codigo}`);

  return data;
}
