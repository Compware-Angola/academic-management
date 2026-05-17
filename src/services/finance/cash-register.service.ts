import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type CashRegister = {
  id: number;
  name: string;
  code?: string;
  status: "aberto" | "fechado";
  blocked: "S" | "N";
  operatorId?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ListCashRegisterFilters = {
  search?: string;
  status?: string;
  blocked?: string;
};

export type ListCashRegistersResponse = {
  data: {
    code: number;
    name: string;
    blocked: "S" | "N";
    operator_code: number;
    operator_name: string;
    status: "aberto" | "fechado";
    opening_code: string;
  }[];

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type OpenCashRegisterPayload = {
  id: number;
  openingAmount: number;
  operatorId: number;
};

export async function listCashRegistersService(
  filters?: ListCashRegisterFilters,
): Promise<ListCashRegistersResponse> {
  const { data } = await axiosNestFinance.get<ListCashRegistersResponse>(
    "/caixas",
    {
      params: filters,
    },
  );

  return data;
}

export async function createCashRegisterService(
  payload: Pick<CashRegister, "name">,
): Promise<CashRegister> {
  const { data } = await axiosNestFinance.post("/caixas", payload);

  return data.data;
}

export async function updateCashRegisterService(
  id: number,
  payload: Partial<CashRegister>,
): Promise<CashRegister> {
  const { data } = await axiosNestFinance.patch(`/caixas/${id}`, payload);

  return data.data;
}

export type CreateCashRegisterPayload = {
  id: number;
  openingAmount: number;
  operatorId: number;
};

export async function openCashRegisterService(
  payload: OpenCashRegisterPayload,
): Promise<CashRegister> {
  const { data } = await axiosNestFinance.patch(`/caixas/${payload.id}/abrir`, {
    openingAmount: payload.openingAmount,
    operatorId: payload.operatorId,
  });

  return data.data;
}
export async function closeCashRegisterService(id: number): Promise<void> {
  const { data } = await axiosNestFinance.patch(`/caixas/${id}/close`);

  return data.data;
}
export async function deleteCashRegisterService(id: number): Promise<void> {
  const { data } = await axiosNestFinance.delete(`/caixas/${id}`);

  return data.data;
}

export async function myCashRegisterService(): Promise<CashRegister> {
  const { data } = await axiosNestFinance.get(`/caixas/me`);

  return data.data;
}

export async function avaliableCashRegistersForOpeningService(
  search?: string,
): Promise<{ data: CashRegister[] }> {
  const { data } = await axiosNestFinance.get<{ data: CashRegister[] }>(
    `/caixas/disponiveis`,
    {
      params: { search },
    },
  );

  return data;
}

export type CashRegisterPaymentSummary = {
  forma_pagamento_codigo: number;
  forma_pagamento: string;
  total: number;
};

export async function getMyCashRegisterSummaryService(): Promise<
  CashRegisterPaymentSummary[]
> {
  const { data } = await axiosNestFinance.get(`/caixas/me/resumo`);

  return data.data;
}
export type UserOperator = {
  codigo: number;
  nome: string;
};

export type ListAvailableOperatorsResponse = {
  data: UserOperator[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ListAvailableOperatorsFilters = {
  search?: string;
  page?: number;
  limit?: number;
};

export async function listAvailableOperatorsService(
  filters?: ListAvailableOperatorsFilters,
): Promise<ListAvailableOperatorsResponse> {
  const { data } = await axiosNestFinance.get<ListAvailableOperatorsResponse>(
    `/caixas/operators/available`,
    {
      params: filters,
    },
  );

  return data;
}
