import { axiosNestFinance } from "@/lib/axios-nest-finance";

export async function estadoBolsaInactiveService(codigo: number) {
  const { data } = await axiosNestFinance.patch(`/bolsa/${codigo}/inactive`);
  return data;
}

export async function estadoBolsaActiveService(codigo: number) {
  const { data } = await axiosNestFinance.patch(`/bolsa/${codigo}/active`);
  return data;
}
