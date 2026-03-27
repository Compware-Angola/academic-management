import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type MesTemp = {
  mesTempId: number;
  servicoId: number;
};

export type CreateIsencaoMensalidadeBody = {
  codigoMatricula: number;
  mesTemps: MesTemp[];
  codigoAnoLectivo: number;
  codigoPreInscricao?: number;
  codigoUtilizador?: number;
  canal?: number;
  obs?: string;
};

export async function createIsencaoMensalidade(
  body: CreateIsencaoMensalidadeBody,
) {
  const { data } = await axiosNestFinance.post("/isencao/mensalidade", body);

  return data;
}
