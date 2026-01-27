import { axiosApexGa } from "@/lib/axios-apex-ga";

export type CreateBolsaBody = {
  designacao: string;
  codigoInstituicao: number;
  codigoTipoDesconto: number;
  valorDesconto: number;
  codigoTipoCredito: number;
};

export async function createBolsa(body: CreateBolsaBody) {
  const { data } = await axiosApexGa.post("/financa/bolsa", body);
  return data;
}
