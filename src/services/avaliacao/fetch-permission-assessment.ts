import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- PAYLOAD ---------- */
export type GetAssessmentPermissionsPayload = {
  anoLectivo: string;
  page?: number;
  limit?: number;
};

/* ---------- RESPONSE ---------- */
export type AssessmentPermissionItem = {
  codigo_permissao: number;
  estado: number;
  data_fim: string;
  ano_lectivo: string;
  curso: string;
  avaliacao: string;
  utilizador: string;
  disciplina: string;
  data_inicio: string;
  created_at: string;
};

export type GetAssessmentPermissionsResponse = {
  data: AssessmentPermissionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function getAssessmentPermissionsService(
  payload: GetAssessmentPermissionsPayload
): Promise<GetAssessmentPermissionsResponse> {
  const { anoLectivo, page = 1, limit = 25 } = payload;

  const { data } = await axiosNestGa.get<GetAssessmentPermissionsResponse>(
    "/assessment/permissoes",
    {
      params: {
        anoLectivo,
        page,
        limit,
      },
    }
  );

  return data;
}
