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

  export type AcademicHistoryEquivalencyRecord = {
  codigo: number
  unidade_curricular: string
  classes: string
  nota: number
  ano_lectivo: string
  curso: string
}
export type AcademicHistoryEquivalencyResponse = {
  success: boolean
  data: AcademicHistoryEquivalencyRecord[]
  page: number
  limit: number
  hasNextPage: boolean
}



export type GetAcademicHistoryEquivalencyParams = {
  anoLectivoId?: number;
  matriculaId: number;
  search?: string;
  page?: number;
  limit?: number;
}
  export const studentAcademicHistoryEquivalencyService = async ({
    anoLectivoId,
    matriculaId,
    search,
    page = 1,
    limit = 25
  }: GetAcademicHistoryEquivalencyParams): Promise<AcademicHistoryEquivalencyResponse> => {
    const { data } = await axiosNestGa.get<AcademicHistoryEquivalencyResponse>(
      '/students/academic-history-equivalencia',
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


 