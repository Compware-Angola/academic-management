import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GradeCurricularPayload = {
  classe: number;
  curso: number;
  anoLectivo: number;
  page?: number;
  limit?: number;
};

export type GradeCurricularItem = {
  codigo: number;
  codigo_disciplina: number;
  descricao_disciplina: string;
  descricao_curso: string;
  codigo_curso: number;
  descricao_classe: string;
  codigo_classe: number;
  codigo_semestre: number;
  designacao_semestre: string;
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
  const { classe, curso, anoLectivo, page = 1, limit = 25 } = payload;

  const { data } = await axiosNestGa.get<GradeCurricularResponse>(
    "/discipline/grade-curricular",
    {
      params: {
        classe,
        curso,
        anoLectivo,
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
