import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ColisaoIsentaMatriculaItem = {
  numero: number;
  codigo: number;
  matricula: number;
  nome: string;
  ano_lectivo: string;
  data: string;
  ref_utilizador: string;
};

export type ColisaoIsentaCursoItem = {
  numero: number;
  codigo: number;
  codigo_curso: number;
  curso: string;
  codigo_turno: number;
  turno: string;
  ano_lectivo: string;
  data: string;
  ref_utilizador: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchColisoesIsentasMatriculasParams = {
  page?: number;
  limit?: number;
  anoLectivo?: number;
  search?: string;
};

export type FetchColisoesIsentasCursosParams = {
  page?: number;
  limit?: number;
  anoLectivo?: number;
  curso?: number;
  turno?: number;
};

export async function fetchColisoesIsentasMatriculasService({
  page = 1,
  limit = 10,
  anoLectivo = 0,
  search = "",
}: FetchColisoesIsentasMatriculasParams): Promise<
  PaginatedResponse<ColisaoIsentaMatriculaItem>
> {
  const { data } = await axiosNestGa.get<
    PaginatedResponse<ColisaoIsentaMatriculaItem>
  >("/registration/colisoes-isentas/matriculas", {
    params: {
      page,
      limit,
      anoLectivo,
      search,
    },
  });

  return data;
}

export async function fetchColisoesIsentasCursosService({
  page = 1,
  limit = 10,
  anoLectivo = 0,
  curso = 0,
  turno = 0,
}: FetchColisoesIsentasCursosParams): Promise<
  PaginatedResponse<ColisaoIsentaCursoItem>
> {
  const { data } = await axiosNestGa.get<
    PaginatedResponse<ColisaoIsentaCursoItem>
  >("/registration/colisoes-isentas/cursos", {
    params: {
      page,
      limit,
      anoLectivo,
      curso,
      turno,
    },
  });

  return data;
}