import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AcademicRecord = {
  curso: string;
  unidade_curricular: string;
  tipo_avaliacao: string;
  ano_lectivo: string;
  ano_curricular: string;
  nota_anterior: number;
  utilizador: string;
  observacao: string | null;
  nota: number;
  datalancamento: string;
  datadeatualizacao: string;
}

export type AcademicHistoryResponse = {
  data: AcademicRecord[];
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export type GetAcademicHistoryParams = {
  anoLectivoId: number;
  matriculaId: number;
  search?: string;
  page?: number;
  limit?: number;
}

export const studentAcademicHistoryService = async ({
    anoLectivoId,
    matriculaId,
    search,
    page = 1,
    limit = 25
  }: GetAcademicHistoryParams): Promise<AcademicHistoryResponse> => {
    const { data } = await axiosNestGa.get<AcademicHistoryResponse>(
      '/students/academic-history',
      {
        params: {
          anoLectivoId,
          matriculaId,
          page,
          search,
          limit
        }
      }
    );
    return data;
  }