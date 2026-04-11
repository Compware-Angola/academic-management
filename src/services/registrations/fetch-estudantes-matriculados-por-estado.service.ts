import { axiosNestGa } from "@/lib/axios-nest-ga";

export type EstudantePorEstadoMatriculaItem = {
  numero: number;
  matricula: number;
  nome: string;
  tipo_aluno: string;
  telefone: string;
  email: string;
  curso: string;
  ano_curricular: number;
  estado: string;
  cor: string;
};

export type FetchEstudantesPorEstadoMatriculaResponse = {
  data: EstudantePorEstadoMatriculaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchEstudantesPorEstadoMatriculaParams = {
  page?: number;
  limit?: number;
  anoLectivo?: number;
  curso?: number;
  turno?: number;
  estado?: number;
  anoCurricular?: number;
  search?: string;
};

export async function fetchEstudantesPorEstadoMatriculaService({
  page = 1,
  limit = 10,
  anoLectivo = 0,
  curso = 0,
  turno = 0,
  estado = 0,
  anoCurricular = 0,
  search = "",
}: FetchEstudantesPorEstadoMatriculaParams): Promise<FetchEstudantesPorEstadoMatriculaResponse> {
  const { data } =
    await axiosNestGa.get<FetchEstudantesPorEstadoMatriculaResponse>(
      "/registration/estudantes-por-estado-matricula",
      {
        params: {
          page,
          limit,
          anoLectivo,
          curso,
          turno,
          estado,
          anoCurricular,
          search,
        },
      }
    );

  return data;
}