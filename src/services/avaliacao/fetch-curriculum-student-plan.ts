import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetCurricularPlanStudentPayload = {
  anoLectivo: number;
  matricula: number;
};

export type CurricularPlanStudentItem = {
  codigo_grade_curricular_aluno: number;
  codigo_grade_curricular: number;
  codigo_matricula: number;
  created_at: string; // ISO Date
  designacao_disciplina: string;
};

export type GetCurricularPlanStudentResponse = CurricularPlanStudentItem[];

export async function getCurricularPlanStudentService(
  payload: GetCurricularPlanStudentPayload
): Promise<GetCurricularPlanStudentResponse> {
  const { anoLectivo, matricula } = payload;

  const { data } = await axiosNestGa.get<GetCurricularPlanStudentResponse>(
    "/assessment/search-curriculum-plan-student",
    {
      params: {
        codigoAnoLectivo: anoLectivo,
        codigoMatricula: matricula,
      },
    }
  );

  return data;
}
