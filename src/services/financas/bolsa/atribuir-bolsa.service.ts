import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface AtribuirBolsaPayload {
  codigoMatricula: number;
  codigoAnoLectivo: number;
  semestre: number;
  codigoBolsa: number;
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
