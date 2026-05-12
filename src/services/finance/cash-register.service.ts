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

export async function openCashRegisterService(
  id: number,
): Promise<CashRegister> {
  const { data } = await axiosNestFinance.patch(`/caixas/${id}/open`);

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
