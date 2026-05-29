import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface AtribuirBolsaPayload {
  codigoMatricula: number;
  codigoAnoLectivo: number;
  semestre: number;
  codigoBolsa: number;
  isentaMulta: "NAO" | "SIM";
}

export interface AtribuirBolsaResponse {
  message?: string;
}

export async function atribuirBolsa(
  payload: AtribuirBolsaPayload,
): Promise<AtribuirBolsaResponse> {
  const { data } = await axiosNestFinance.post<AtribuirBolsaResponse>(
    "credito-educacional",
    payload,
  );
  return data;
}
type UpdateBolsaEstudantePayload = AtribuirBolsaPayload & {
  codigoCreditoEducacional: number;
};
export async function updateBolsaEstudanteService(
  payload: UpdateBolsaEstudantePayload,
): Promise<AtribuirBolsaResponse> {
  const { codigoCreditoEducacional, ...rest } = payload;
  const { data } = await axiosNestFinance.put<AtribuirBolsaResponse>(
    `credito-educacional/${codigoCreditoEducacional}`,
    rest,
  );
  return data;
}
