import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface AssessmentPermissionPayload {
  anoLectivo: number;
  unidadeCurricular: number;
  docenteId: number;
  tipoAvalacaoId: number;
  dataInicio: string;
  dataFim: string;
}

export interface AssessmentPermissionResponse {
  success: boolean;
  message: string;
}

export async function createAssessmentPermission(
  userId: number,
  payload: AssessmentPermissionPayload
): Promise<AssessmentPermissionResponse> {
  const { data } = await axiosNestGa.post<AssessmentPermissionResponse>(
    "/assessment/permissoes",
    {
      userId,
      ...payload,
    }
  );

  return data;
}
