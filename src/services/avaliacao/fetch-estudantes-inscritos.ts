import { axiosNestGa } from "@/lib/axios-nest-ga";
export type EstudanteInscritoResponse = {
  codigo_matricula: number;
  codigo_disciplina: number;
  disciplina_designacao: string;
  codigo_grade: number;
  estado: "anulado" | "validado" | "pendente";
  avaliacao: string;
  nome: string;
};
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
export type EstudantesInscritosQuery = {
  anoLectivo: number;
  semestre: number;
  periodo: number;
  curso: number;
  unidadeCurricular: number;
  anoCurricular: number;
  tipoAvaliacao: number;
  horarioId: number;
  page?: number;
  limit?: number;
};

export async function getEstudantesInscritosService(
  params: EstudantesInscritosQuery
): Promise<PaginatedResponse<EstudanteInscritoResponse>> {
  const { data } = await axiosNestGa.get<
    PaginatedResponse<EstudanteInscritoResponse>
  >("/assessment/estudantes-inscritos", {
    params: { ...params, page: params.page ?? 1, limit: params.limit ?? 25 },
  });

  return data;
}
