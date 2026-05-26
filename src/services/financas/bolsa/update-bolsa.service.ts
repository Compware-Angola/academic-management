import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type UpdateBolsaRequest = {
  codigo: number;
  designacao: string;
  codigoInstituicao: number;
  codigoTipoDesconto: number;
  valorDesconto: number;
  codigoTipoCredito: number;
};

export async function updateBolsaService({
  codigo,
  ...body
}: UpdateBolsaRequest) {
  const { data } = await axiosNestFinance.put(`/bolsa/${codigo}`, body);

  return data;
}
