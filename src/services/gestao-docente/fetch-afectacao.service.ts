import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListAfectacaoDocentesPayload = {
  anoLectivo: number;
  semestre?: number;
  unidadeCurricular?: number;
  curso?: number;
  anoCurricular?: number;
  docente?: number;
  page?: number;
  limit?: number;
};

export type AfectacaoDocenteItem = {
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

export type ListAfectacaoDocentesResponse = {
  data: AfectacaoDocenteItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListAfectacaoDocentesService(
  payload: ListAfectacaoDocentesPayload,
): Promise<ListAfectacaoDocentesResponse> {
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

  const { data } = await axiosNestGa.get<ListAfectacaoDocentesResponse>(
    "/docentes/afectacao",
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
