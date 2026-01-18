import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface AtribuirCreditoEducacionalPayload {
  codigoMatricula: number;
  codigoInstituicao: number;
  codigoAnoLectivo: number;
  semestre: number;
  codigoCredito: number;
  codigoUtilizador: number;
}

export interface AtribuirCreditoEducacionalResponse {
  message?: string;
}

export async function atribuirCreditoEducacional(
  payload: AtribuirCreditoEducacionalPayload
): Promise<AtribuirCreditoEducacionalResponse> {
  const { data } = await axiosApexGa.post<AtribuirCreditoEducacionalResponse>(
    "financa/credito-educacional/estudante",
    payload
  );
  return data;
}
