import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListDocentesAfectacaoPayload = {
  anoLectivo: number;
  tipoAfectacao: number;
  semestre?: number;
  docente?: number;
  dataInicial?: string;
  dataFinal?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type DocenteAfectacaoItem = {
  docente: string;
  mecanografico: string;
  codigo_docente: number;
};

export type ListDocentesAfectacaoResponse = {
  data: DocenteAfectacaoItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListDocentesAfectacaoService(
  payload: ListDocentesAfectacaoPayload,
): Promise<ListDocentesAfectacaoResponse> {
  const {
    anoLectivo,
    tipoAfectacao,
    semestre,
    docente,
    dataInicial,
    dataFinal,
    search,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<ListDocentesAfectacaoResponse>(
    "/docente-gestao/docente/afectacao",
    {
      params: {
        anoLectivo,
        tipoAfectacao,
        semestre,
        docente,
        dataInicial,
        dataFinal,
        page,
        limit,
        search,
      },
    },
  );

  return data;
}
