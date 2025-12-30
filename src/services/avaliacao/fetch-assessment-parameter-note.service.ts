import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetAssessmentParametersNotePayload = {
  search?: string;
};

export type AssessmentParameterNote = {
  descricao: string;
  observacao1: string | null;
  observacao: string | null;
  info1: string | null;
  info2: string | null;
  info3: string | null;
  activo: number;
  funcao: string | null;
  created_at: string;
  updated_at: string;
  codigo: number;
};

export type GetAssessmentParametersNoteResponse = AssessmentParameterNote[];

export async function getAssessmentParametersNoteService(
  payload: GetAssessmentParametersNotePayload
): Promise<GetAssessmentParametersNoteResponse> {
  const { search } = payload;

  const { data } = await axiosNestGa.get<GetAssessmentParametersNoteResponse>(
    "/assessment/parametros-avaliacoes",
    {
      params: {
        search,
      },
    }
  );

  return data;
}
