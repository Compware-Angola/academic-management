import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetDisciplineDepartmentPayload = {
  departamento: number;
  classe: number;
  semestre: number;
  page?: number;
  limit?: number;
};

export type DisciplineDepartment = {
  codigo_grade: number;
  codigo_disciplina: number;
  unidade_curricular: string;
  codigo_classe: number;
  ano_curricular: string;
  codigo_semestre: number;
  semestre: string;
  codigo_departamento: number;
  status: number;
};

export type GetDisciplineDepartmentResponse = {
  data: DisciplineDepartment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchDepartamentoUC(
  payload: GetDisciplineDepartmentPayload,
): Promise<GetDisciplineDepartmentResponse> {
  const { departamento, classe, semestre, page = 1, limit = 25 } = payload;

  const { data } = await axiosNestGa.get<GetDisciplineDepartmentResponse>(
    "/discipline/departamento",
    {
      params: {
        departamento,
        classe,
        semestre,
        page,
        limit,
      },
    },
  );

  return data;
}
