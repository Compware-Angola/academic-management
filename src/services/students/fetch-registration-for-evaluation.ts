import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface GetRegistrationForEvaluationParams {
  page?: number;
  limit?: number;
  codigoAnoLectivo?: number;
  codigoMatricula?: number;
  codigoCurso?: number;
  codigoClasse?: number;
  codigoSemestre?: number;
  codigoDisciplina?: number;
  estadoFactura?: number;
  tipoAvaliacao?: number;
  codigoHorario?: number;
  codigoGrade?: number;
  search?: string;
}

export interface RegistrationForEvaluation {
  disciplina: string;
  codigo_disciplina: number;
  avaliacao: string;
  codigo_tipo_avaliacao: number;
  codigo_factura: number;
  data_factura: string;
  estado_factura: number;
  codigo_inscricao: number;
  nota: number;
  codigo_matricula: number;
  nome_completo: string;
  codigo_grade: number;
  codigo_curso: number;
  codigo_classe: number;
  codigo_semestre: number;
  semestre: string;
  curso: string;
  classe: string;
  ano_lectivo: string;
  codigo_ano_lectivo: string;
}

export interface GetRegistrationForEvaluationResponse {
  data: RegistrationForEvaluation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getRegistrationForEvaluationService = async ({
  page = 1,
  limit = 25,
  codigoAnoLectivo,
  codigoMatricula,
  codigoCurso,
  codigoClasse,
  codigoSemestre,
  codigoDisciplina,
  estadoFactura,
  codigoHorario,
  tipoAvaliacao,
  codigoGrade,
  search,
}: GetRegistrationForEvaluationParams): Promise<GetRegistrationForEvaluationResponse> => {
  const { data } = await axiosNestGa.get<GetRegistrationForEvaluationResponse>(
    "/students/inscricoes-avaliacao",
    {
      params: {
        page,
        limit,
        codigoGrade,
        codigoAnoLectivo,
        codigoMatricula,
        codigoCurso,
        codigoClasse,
        codigoSemestre,
        codigoDisciplina,
        estadoFactura,
        tipoAvaliacao,
        search,
        codigoHorario,
      },
    },
  );

  return data;
};
