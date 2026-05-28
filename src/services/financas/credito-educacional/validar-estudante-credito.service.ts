import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface ValidarEstudanteCreditoParams {
  codigoMatricula: number;
  codigoAnoLectivo: number;
  semestre: number;
}

export interface ValidarEstudanteCreditoResponse {
  codigo_matricula: number;
  nome_completo: string;
  bi: string;
  curso: string;
  periodo: string;
  estado_matricula: string;
  ja_bolsista: boolean;
  codigo_bolseiro?: number | null;
  codigo_bolsa?: number | null;
  bolsa?: string | null;
  status_bolseiro?: number | null;
  codigo_ano_lectivo?: number | null;
  semestre?: number | null;
}

export async function validarEstudanteCredito(
  params: ValidarEstudanteCreditoParams,
): Promise<ValidarEstudanteCreditoResponse> {
  const { data } = await axiosNestFinance.get<ValidarEstudanteCreditoResponse>(
    "credito-educacional/estudante/validar",
    { params },
  );

  return data;
}
