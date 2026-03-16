import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListTeachersPayload = {
  area?: number;
  search?: string;
  page?: number;
  limit?: number;
};

export type TeachersItem = {
  codigo: number;
  numero_mec: string | null;
  nome: string | null;
  email: string | null;
  escalao: string | null;
  categoria: string | null;
  grau_academico: string | null;
  area_formacao_id: number | null;
};

export type ListDocentesResponse = {
  data: TeachersItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListTeachersService(payload: ListTeachersPayload) {
  const {
    area = 0,
    search,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<ListDocentesResponse>(
    "/docente-gestao/docentes",
    {
      params: {
        area: area || undefined,
        search: search?.trim() || undefined,
        page,
        limit,
      },
    }
  );

  return data;
}