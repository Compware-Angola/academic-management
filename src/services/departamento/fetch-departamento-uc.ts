import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface GetDepartmentDisciplineParams {
  departamento: number;
  page?: number;
  limit?: number;
  search?: string;
}

export interface DepartmentDiscipline {
  codigo_grade: number;
  codigo_disciplina: number;
  unidade_curricular: string;
  codigo_departamento: number;
  status: number;
}

export interface GetDepartmentDisciplineResponse {
  data: DepartmentDiscipline[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getDepartmentDisciplinesService = async ({
  departamento,
  page = 1,
  limit = 25,
  search,
}: GetDepartmentDisciplineParams): Promise<GetDepartmentDisciplineResponse> => {
  const { data } = await axiosNestGa.get<GetDepartmentDisciplineResponse>(
    "/discipline/departamento",
    {
      params: {
        departamento,
        page,
        limit,
        search,
      },
    },
  );

  return data;
};
