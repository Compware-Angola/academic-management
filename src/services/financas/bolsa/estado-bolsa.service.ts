import { axiosNestFinance } from "@/lib/axios-nest-finance";

export async function switchEstadoBolsaService(codigo: number) {
  const { data } = await axiosNestFinance.patch(`/bolsa/${codigo}/switch`);
  return data;
}
