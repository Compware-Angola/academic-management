// src/services/assessment/create-assessment-permission.service.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";
import { AuthStorage } from "@/util/auth-storage";

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
  payload: AssessmentPermissionPayload
): Promise<AssessmentPermissionResponse> {
  const userId = AuthStorage.getUser().user_id;

  const { data } = await axiosNestGa.post<AssessmentPermissionResponse>(
    "/assessment/permissoes",
    {
      userId,
      ...payload,
    }
  );

  return data;
}
