import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface AtribuirBolsaPayload {
  codigoMatricula: number;
  codigoAnoLectivo: number;
  semestre: number;
  codigoBolsa: number;
  codigoUtilizador: number;
}

export interface AtribuirBolsaResponse {
  message?: string;
}

export async function atribuirBolsa(
  payload: AtribuirBolsaPayload,
): Promise<AtribuirBolsaResponse> {
  const { data } = await axiosApexGa.post<AtribuirBolsaResponse>(
    "financa/bolsa/estudante",
    payload,
  );
  return data;
}
