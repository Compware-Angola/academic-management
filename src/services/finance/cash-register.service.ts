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

export type ListCashRegisterPayload = {
  search?: string;
  status?: string;
  blocked?: string;
};

export async function listCashRegistersService(
  payload?: ListCashRegisterPayload,
): Promise<CashRegister[]> {
  const { data } = await axiosNestFinance.get("/caixas", {
    params: payload,
  });

  return data.data;
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
};

export async function openCashRegisterService(
  payload: CreateCashRegisterPayload,
): Promise<CashRegister> {
  const { data } = await axiosNestFinance.patch(`/caixas/${payload.id}/open`, {
    openingAmount: payload.openingAmount,
  });

  return data.data;
}

export async function closeCashRegisterService(
  id: number,
): Promise<CashRegister> {
  const { data } = await axiosNestFinance.patch(`/caixas/${id}/close`);

  return data.data;
}

export async function deleteCashRegisterService(id: number) {
  const { data } = await axiosNestFinance.delete(`/caixas/${id}`);

  return data.data;
}

export async function myCashRegisterService(): Promise<CashRegister> {
  const { data } = await axiosNestFinance.get(`/caixas/meu-caixa`);

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
