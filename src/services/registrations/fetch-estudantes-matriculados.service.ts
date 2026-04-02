import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListEstudantesMatriculadosPayload = {
  codigoAnoLectivo: number;
  codigoCurso: number;
  periodo: number;
  anoCurricular?: number;
  tipoEstudante?: number;
  page?: number;
  limit?: number;
};

export type EstudanteMatriculadoItem = {
  codigomatricula: number;
  nome: string;
  telefone: string;
  genero: string;
  anolectivo: string;
  curso: string;
  periodo: string;
  datamatricula: string;
  classe: string;
  tipo: string;
};

export type ListEstudantesMatriculadosResponse = {
  data: EstudanteMatriculadoItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListEstudantesMatriculadosService(
  payload: ListEstudantesMatriculadosPayload,
): Promise<ListEstudantesMatriculadosResponse> {
  const {
    codigoAnoLectivo,
    codigoCurso,
    periodo,
    anoCurricular,
    tipoEstudante,
    page = 1,
    limit = 20,
  } = payload;

  const { data } = await axiosNestGa.get<ListEstudantesMatriculadosResponse>(
    "/registration/estudantes-matriculados",
    {
      params: {
        codigoAnoLectivo,
        codigoCurso,
        periodo,
        anoCurricular,
        tipoEstudante,
        page,
        limit,
      },
    },
  );

  return data;
}
