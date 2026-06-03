import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ScheduleParams = {
anoLectivo?: number;
semestre?: number;
curso?: number;
classe?: number;
page?: number;
limit?: number;
searchTerm?: string;
};

export type StudentWithoutSchedule = {
  codigo_matricula: number
  nome: string
  codigo_grade_aluno: number
  codigo_grade: number
  disciplina: string
  codigo_disciplina: number
  codigo_semestre: number
  semestre: string
  codigo_curso: number
  curso: string
  codigo_classe: number
  classe: string
};
type ScheduleResponse = {
  data: StudentWithoutSchedule[];
  total: number
  page: number
  limit: number
  totalPages: number
};

export const fetchStudentsWithoutSchedule = async (
  params: ScheduleParams
): Promise<ScheduleResponse> => {
  const queryParams = new URLSearchParams({
    anoLectivo: params.anoLectivo.toString(),
    page: (params.page || 1).toString(),
    limit: (params.limit || 25).toString(),
  });

  if (params.semestre)
    queryParams.append("semestre", params.semestre.toString());
  if (params.curso) queryParams.append("curso", params.curso.toString());
  if (params.classe)
    queryParams.append("classe", params.classe.toString());
  if (params.searchTerm)
    queryParams.append("searchTerm", params.searchTerm.toString());
  const response = await axiosNestGa.get<ScheduleResponse>("schedule/estudantes-sem-horarios", {
    params: queryParams,
  });
  return response.data;
};
