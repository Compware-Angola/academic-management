import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface UpdateAssessmentParametersNotePayload {
  descricao?: string;
  observacao1?: number;
  observacao?: number;
  info1?: string;
  info2?: string;
  info3?: string;
  activo?: number;
  funcao?: string;
}

export const updateAssessmentParametersNoteService = async ({
  parametroId,
  payload,
}: {
  parametroId: number | string;
  payload: UpdateAssessmentParametersNotePayload;
}) => {
  const response = await axiosNestGa.put(
    `/assessment/parametros-avaliacoes/${parametroId}`,
    payload
  );

  return response.data;
};
