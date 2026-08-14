import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GradeCurricularPayload = {
  classe: number;
  semestre?: number;
  curso: number;
  anoLectivo: number;
  estado: number;
  page?: number;
  limit?: number;
};
export type ToggleStatusGradeCurricularPayload = {
  codigo: number;
  status: 0 | 1;
};

export type GradeCurricularItem2 = {
  codigo: number;
  codigo_disciplina: number;
  codigo_curso: number;
  codigo_classe: number;
  codigo_semestre: number;
  status: 0 | 1;
};

export type GradeCurricularItem = {
  codigo: number;
  codigo_plano_curricular: number;
  descricao_plano_curricular: string;

  codigo_grade_curricular: number;
  codigo_disciplina: number;

  descricao_disciplina: string;
  descricao_curso: string;
  codigo_curso: number;

  descricao_classe: string;
  codigo_classe: number;

  codigo_semestre: number;
  designacao_semestre: string;

  peso_primeira_freq: number | null;
  peso_segunda_freq: number | null;
  peso_pratica: number | null;

  nota_min_primeira_freq: number | null;
  nota_min_segunda_freq: number | null;
  nota_min_pratica: number | null;

  status: number;
};

export type GradeCurricularResponse = {
  data: GradeCurricularItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AddUCToPlanPayload = {
  codigoDisciplina: number;
  codigoAnoLectivo: number;
  codigoSemestre: number;
  codigoClasse: number;
  codigoCurso: number;
};

export async function getGradeCurricular(
  payload: GradeCurricularPayload,
): Promise<GradeCurricularResponse> {
  const { classe, curso, anoLectivo, estado, page = 1, limit = 25 } = payload;

  const { data } = await axiosNestGa.get<GradeCurricularResponse>(
    "/discipline/grade-curricular",
    {
      params: {
        classe,
        curso,
        anoLectivo,
        estado,
        page,
        limit,
      },
    },
  );

  return data;
}

export async function getGradeCurricular2(
  payload: Omit<GradeCurricularPayload, "anoLectivo">,
): Promise<GradeCurricularResponse> {
  const { classe, curso, semestre, estado, page = 1, limit = 25 } = payload;

  const { data } = await axiosNestGa.get<GradeCurricularResponse>(
    "/discipline/grade-curricular2",
    {
      params: {
        classe,
        semestre,
        curso,
        estado,
        page,
        limit,
      },
    },
  );

  return data;
}

export interface AddUCsToPlanPayload {
  codigosDisciplina: number[];
  codigoAnoLectivo: number;
  codigoCurso: number;
  codigoClasse: number;
  codigoSemestre?: number;
}

export interface AddUCsToPlanResponse {
  message: string;
  adicionadas: { codigoDisciplina: number; codigoGrade: number }[];
  reativadas: { codigoDisciplina: number; codigoGrade: number }[];
  falhas: {
    codigoDisciplina: number;
    motivo: string;
    jaNoPlano?: boolean;
  }[];
}

export async function addUCsToPlan(
  payload: AddUCsToPlanPayload,
): Promise<AddUCsToPlanResponse> {
  const response = await axiosNestGa.post(
    `/discipline/plano-curricular/lote`,
    payload,
    { showError: false },
  );
  return response.data;
}

export async function toggleStatusGradeCurricular({
  codigo,
  status,
}: ToggleStatusGradeCurricularPayload): Promise<GradeCurricularItem2> {
  const { data } = await axiosNestGa.patch<GradeCurricularItem2>(
    `/discipline/grade-curricular/${codigo}/status`,
    { status },
  );

  return data;
}

// --- DELETAR GRADE CURRICULAR NO PLANO

export interface DeletePlanoCurricularParams {
  codigoCurso: number;
  codigoAnoLectivo: number;
  codigoGrade: number;
}

export interface DeletePlanoCurricularResponse {
  message: string;
  [key: string]: any;
}

export const deletePlanoCurricularService = async ({
  codigoCurso,
  codigoAnoLectivo,
  codigoGrade,
}: DeletePlanoCurricularParams): Promise<DeletePlanoCurricularResponse> => {
  const { data } = await axiosNestGa.delete<DeletePlanoCurricularResponse>(
    "/discipline/plano-curricular",
    {
      params: {
        codigoCurso,
        codigoAnoLectivo,
        codigoGrade,
      },
    },
  );

  return data;
};
