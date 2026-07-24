import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListTeachersPayload = {
  grauAcademico?: number;
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
  faculdadeid: number | null;
  ano_experiencia: number | null;
  proposta_contratacao: string | null;

  valor_hora: number | null;
  codigo_contrato: number | null;

  data_inicio_docencia: string | null;

  apreciacao: string | null;
  codigo_validacao: string | null;

  escalaoid: number | null;
  categoriaid: number | null;
  candidaturaid: number | null;
};

export type ListDocentesResponse = {
  data: TeachersItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListTeachersService(payload: ListTeachersPayload) {
  const { area = 0, search, page = 1, limit = 25, grauAcademico } = payload;

  const { data } = await axiosNestGa.get<ListDocentesResponse>(
    "/docente-gestao/docentes",
    {
      params: {
        area: area || undefined,
        search: search?.trim() || undefined,
        page,
        limit,
        grauAcademico: grauAcademico || undefined,
      },
    },
  );

  return data;
}
