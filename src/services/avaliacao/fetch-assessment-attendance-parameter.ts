import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AssessmentAttendanceParameter = {
  descricao: string;
  observacao: string;
  observacao_2: string | null;
  observacao_3: string | null;
  activo: number;
  created_at: string;
  updated_at: string;
  sigla: string | null;
  descricao_parametro: string | null;
  modulo: string | null;
  codigo: number;
  atualizadopor: string;
};

export type GetAssessmentAttendanceParameterResponse = {
  data: AssessmentAttendanceParameter[];
};

export async function getAssessmentAttendanceParameterService(): Promise<GetAssessmentAttendanceParameterResponse> {
  const { data } =
    await axiosNestGa.get<GetAssessmentAttendanceParameterResponse>(
      "/assessment/parametros-avaliacoes-attendance-list",
    );

  return data;
}
