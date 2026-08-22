import { axiosNestGa } from "@/lib/axios-nest-ga";

export type EstudantesMatriculadosStatisticsParams = {
  codigoAnoLectivo?: number;
  codigoCurso?: number;
  periodo?: number;
  anoCurricular?: number;
  tipoEstudante?: number;
};

export type EstudanteMatriculadoEstatistica = {
  anoCurricular: string;
  total: number;
};

export type EstudantesMatriculadosStatisticsResponse = {
  data: EstudanteMatriculadoEstatistica[];
};

export async function fetchEstatisticaEstudantesMatriculados(
  params: EstudantesMatriculadosStatisticsParams,
): Promise<EstudantesMatriculadosStatisticsResponse> {
  const { data } =
    await axiosNestGa.get<EstudantesMatriculadosStatisticsResponse>(
      "/registration/estudantes-matriculados/estatistica",
      { params },
    );

  return data;
}
