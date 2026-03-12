// src/services/disciplineService.ts
import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestGa } from "@/lib/axios-nest-ga";
// src/types/discipline.types.ts


export  type DisciplineParams = {
  tipoUnidadeCurricular?: string;
  naturezaUnidadeCurricular?: string;
  status?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export type Discipline = {
  codigo: number
  designacao: string
  nome_abreviatura: string
  codigo_disciplina: string
  duracao: number
  tipo_unidade_curricular: string
  natureza_unidade_curricular: string
  codigo_tipo_uc: number
  codigo_natureza_uc: number
  status_: number
  data_registo: string
  data_ultima_atualizacao: string


  
}

export type DisciplinesResponse = {
  data: Discipline[];
  total: number
  page: number
  limit: number
  totalPages: number
};
export async function fetchDisciplines(params?: DisciplineParams): Promise<DisciplinesResponse> {
  const { tipoUnidadeCurricular, naturezaUnidadeCurricular, status, search, page=1, limit=10 } = params || {};
  const queryParams = {
    tipoUnidadeCurricular,
    naturezaUnidadeCurricular,
    status,
    search,
    page,
    limit,
  };
    const { data } = await axiosNestGa.get<DisciplinesResponse>(
      "discipline/all",
      { params: queryParams }
    );
    return data;
}

export interface CreateDisciplinePayload {
  designacao: string;
  tipoUnidadeCurricular: string;
  naturezaUnidadeCurricular: string;
  codigoDisciplina: string;
  nomeAbreviatura: string;
}

export async function createDiscipline(
  payload: CreateDisciplinePayload
): Promise<any> {
  const response = await axiosNestGa.post("/discipline", payload);
  return response.data;
}
