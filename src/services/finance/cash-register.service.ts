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
  openingCode?: string;
};

export type ListCashRegisterFilters = {
  page?: number;
  limit?: number;
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
type CloseCashRegisterServiceResponse = {
  data: {
    adminOperatorId: number;
    adminStatus: string;
    cashRegisterId: number;
    closingDate: string;
    collectedDepositAmount: number;
    collectedPaymentAmount: number;
    collectedTpaAmount: number;
    createdAt: string;
    createdBy: number;
    dateAt: string;
    deletedAt: string | null;
    deletedBy: number | null;
    finalStatus: string;
    id: number;
    invoicedPaymentAmount: number;
    observation: string | null;
    openingAmount: number;
    operatorId: number;
    rejectionReason: string | null;
    status: string;
    totalCollectedAmount: number;
    updatedAt: string;
    updatedBy: number | null;
    validationDate: string | null;
  };
};
export async function closeCashRegisterService(
  id: number,
): Promise<CloseCashRegisterServiceResponse> {
  const { data } =
    await axiosNestFinance.patch<CloseCashRegisterServiceResponse>(
      `/cash-registers/${id}/close`,
    );

  return data;
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
  movementID: number;
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
  availability?: "all" | "free" | "occupied";
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

// Adicione no arquivo: src/services/finance/cash-register.service.ts

export type CashRegisterMovement = {
  code: number;
  cash_register_id: number;
  cash_register_name: string;
  operator_id: number;
  operator_name: string;
  opening_amount: number;
  total_collected_amount: number;
  collected_deposit_amount: number;
  collected_tpa_amount: number;
  collected_payment_amount: number;
  invoiced_payment_amount: number;
  status: string;
  final_status: string;
  admin_status: string;
  observation: string;
  date_at: string;
  closing_date: string;
  validation_date: string;
  created_at: string;
  updated_at: string;
  opening_time: null | string;
  closing_time: null | string;
  validation_time: null | string;
};

export type ListCashRegisterMovementsResponse = {
  data: CashRegisterMovement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ListCashRegisterMovementsFilters = {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  cashRegisterId?: number;
  operatorId?: number;
  startDate?: string;
  endDate?: string;
};

export async function listCashRegisterMovementsService(
  filters?: ListCashRegisterMovementsFilters,
): Promise<ListCashRegisterMovementsResponse> {
  const { data } =
    await axiosNestFinance.get<ListCashRegisterMovementsResponse>(
      "/cash-registers/movements",
      {
        params: filters,
      },
    );

  return data;
}

// Adicione no arquivo: src/services/finance/cash-register.service.ts

export type ValidateMovementPayload = {
  movementId: number;
  action: "approved" | "rejected";
  rejectionReason?: string;
};

export async function validateMovementService(
  payload: ValidateMovementPayload,
): Promise<void> {
  return axiosNestFinance.patch(
    `/cash-registers/movements/${payload.movementId}/validate`,
    {
      action: payload.action,
      rejectionReason: payload.rejectionReason,
    },
  );
}

export async function recoveryOpeningCodeService(): Promise<void> {
  await axiosNestFinance.patch(`/cash-registers/me/recovery-code`);
}

export async function blockMyCashRegisterService(): Promise<void> {
  await axiosNestFinance.patch(`/cash-registers/me/block`);
}

export type CreateCashRegisterPayload = {
  name: string;
};

export type UpdateCashRegisterPayload = {
  id: number;
  name: string;
};


export async function createCashRegisterService(
  payload: CreateCashRegisterPayload,
): Promise<CashRegister> {
  const { data } = await axiosNestFinance.post("/cash-registers", payload);
  return data.data;
}


export async function updateCashRegisterService(
  payload: UpdateCashRegisterPayload,
): Promise<CashRegister> {
  const { data } = await axiosNestFinance.patch(
    `/cash-registers/${payload.id}`,
    {
      name: payload.name,
    },
  );

  return data.data;
}



export async function deleteCashRegisterService(id: number): Promise<void> {
  await axiosNestFinance.delete(`/cash-registers/${id}`);
}
export type ListPaymentReportsForOperatorFilters = {
  operatorId: number;
  limit?: number;
  page?: number
  search?: string;
  caixaId?: number;
  formaPagamento?: number;
  startDate?: string;
  endDate?: string;
}
export type CashRegisterPaymentReport = {
  data_pagamento: string
  valor_depositado: number
  forma_pagamento: string
  nome_utilizador: string
  aluno: string
  caixa: string | null
  factura_item_codigo: number
  servico_descricao: string
  quantidade: number
  preco: number
  multa: number
  total: number
}
export type ListPaymentReportsForOperatorResponse = {
  data: CashRegisterPaymentReport[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}

export async function listPaymentReportsForOperatorService(
  filters?: ListPaymentReportsForOperatorFilters,
): Promise<ListPaymentReportsForOperatorResponse> {
  const { operatorId, ...rest } = filters
  const { data } = await axiosNestFinance.get(
    `/cash-registers/reports/${operatorId}`,
    { params: rest },
  );
  return data;
}


