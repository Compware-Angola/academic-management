import { axiosNestGa } from "@/lib/axios-nest-ga";

export type EstadoMatriculaPorHorarioItem = {
  numero: number;
  matricula: number;
  nome: string;
  tipo_aluno: string;
  horario: string;
  curso: string;
  estado: string;
  cor: string;
  ano_curricular: number;
};

export type FetchEstadoMatriculaPorHorarioResponse = {
  data: EstadoMatriculaPorHorarioItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchEstadoMatriculaPorHorarioParams = {
  page?: number;
  limit?: number;
  anoLectivo?: number;
  curso?: number;
  anoCurricular?: number;
  semestre?: number;
  turno?: number;
  unidadeCurricular?: number;
  horario?: number;
  estado?: number;
  search?: string;
};

export async function fetchEstadoMatriculaPorHorarioService({
  page = 1,
  limit = 10,
  anoLectivo = 0,
  curso = 0,
  anoCurricular = 0,
  semestre = 0,
  turno = 0,
  unidadeCurricular = 0,
  horario = 0,
  estado = 0,
  search = "",
}: FetchEstadoMatriculaPorHorarioParams): Promise<FetchEstadoMatriculaPorHorarioResponse> {
  const { data } =
    await axiosNestGa.get<FetchEstadoMatriculaPorHorarioResponse>(
      "/registration/estado-matricula-horario",
      {
        params: {
          page,
          limit,
          anoLectivo,
          curso,
          anoCurricular,
          semestre,
          turno,
          unidadeCurricular,
          horario,
          estado,
          search,
        },
      }
    );

  return data;
}