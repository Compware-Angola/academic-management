import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GradeCurricularPayload = {
  classe: number;
  curso: number;
  anoLectivo: number;
  estado: number;
  page?: number;
  limit?: number;
};

export type GradeCurricularItem = {
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

export async function addUCToPlan(payload: AddUCToPlanPayload): Promise<any> {
  const response = await axiosNestGa.post(
    `/discipline/plano-curricular`, // a tua rota exata
    payload,
  );
  return response.data;
}
