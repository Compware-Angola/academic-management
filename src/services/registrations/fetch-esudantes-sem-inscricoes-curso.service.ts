import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListEstudantesSemInscricaoCursoPayload = {
  codigoAnoLectivo: number;
  codigoCurso: number;
  codigoMatricula?: number;
  nome?: string;
  page?: number;
  limit?: number;
};

export type EstudanteSemInscricaoCursoItem = {
  codigo: number;
  nomecompleto: string;
  curso: string;
  tipo: string;
};

export type ListEstudantesSemInscricaoCursoResponse = {
  data: EstudanteSemInscricaoCursoItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListEstudantesSemInscricaoCursoService(
  payload: ListEstudantesSemInscricaoCursoPayload,
): Promise<ListEstudantesSemInscricaoCursoResponse> {
  const {
    codigoAnoLectivo,
    codigoCurso,
    codigoMatricula,
    nome,
    page = 1,
    limit = 20,
  } = payload;

  const { data } =
    await axiosNestGa.get<ListEstudantesSemInscricaoCursoResponse>(
      "/registration/estudantes/sem-inscricoes-curso",
      {
        params: {
          codigoAnoLectivo,
          codigoCurso,
          ...(codigoMatricula && { codigoMatricula }),
          ...(nome && { nome }),
          page,
          limit,
        },
      },
    );

  return data;
}
