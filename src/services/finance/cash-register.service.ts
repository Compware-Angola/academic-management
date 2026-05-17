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
    "/cash-registers",
    {
      params: filters,
    },
  );

  return data;
}

export async function openCashRegisterService(
  payload: OpenCashRegisterPayload,
): Promise<CashRegister> {
  const { data } = await axiosNestFinance.patch(
    `/cash-registers/${payload.id}/open`,
    {
      openingAmount: payload.openingAmount,
      operatorId: payload.operatorId,
    },
  );

  return data.data;
}
export async function closeCashRegisterService(id: number): Promise<void> {
  const { data } = await axiosNestFinance.patch(`/cash-registers/${id}/close`);

  return data.data;
}

export async function myCashRegisterService(): Promise<CashRegister> {
  const { data } = await axiosNestFinance.get(`/cash-registers/me`);

  return data.data;
}

export async function avaliableCashRegistersForOpeningService(
  search?: string,
): Promise<{ data: CashRegister[] }> {
  const { data } = await axiosNestFinance.get<{ data: CashRegister[] }>(
    `/cash-registers/available`,
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
type GetMyCashRegisterSummaryServiceResponse = {
  summary: CashRegisterPaymentSummary[];
  openingAmount: number;
};

export async function getMyCashRegisterSummaryService(): Promise<GetMyCashRegisterSummaryServiceResponse> {
  const { data } = await axiosNestFinance.get(`/cash-registers/me/summary`);

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
    `/cash-registers/operators/available`,
    {
      params: filters,
    },
  );

  return data;
}

export async function verifyMyCashRegisterOpeningCodeService(
  openingCode: string,
): Promise<void> {
  await axiosNestFinance.post(`/cash-registers/me/verify-opening-code`, {
    openingCode,
  });
}
