import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListGestaoAfectacaoDocentesPayload = {
  anoLectivo: number;
  semestre?: number;
  unidadeCurricular?: number;
  curso?: number;
  anoCurricular?: number;
  docente?: number;
  page?: number;
  limit?: number;
};

export type GestaoAfectacaoDocenteItem = {
  codigo: number;
  anolectivo: string;
  uc: string;
  docente: string;
  codigo_docente: number;
  categoria: string;
  classe: string;
  semestre: string;
  curso: string;
  data: string;
  afectadopor: string;
  estado: number;
};

export type ListGestaoAfectacaoDocentesResponse = {
  data: GestaoAfectacaoDocenteItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListGestaoAfectacaoDocentesService(
  payload: ListGestaoAfectacaoDocentesPayload,
): Promise<ListGestaoAfectacaoDocentesResponse> {
  const {
    anoLectivo,
    semestre,
    unidadeCurricular,
    curso,
    anoCurricular,
    docente,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<ListGestaoAfectacaoDocentesResponse>(
    "/docente-gestao/afectacao",
    {
      params: {
        anoLectivo,
        semestre,
        unidadeCurricular,
        curso,
        anoCurricular,
        docente,
        page,
        limit,
      },
    },
  );

  return data;
}
