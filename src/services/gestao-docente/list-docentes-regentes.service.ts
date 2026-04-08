// src/services/access/docentes-regentes/list-docentes-regentes.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- ITEM ---------- */
export type DocenteRegente = {
  codigo_grade: number;
  ano_curricular: string;
  semestre: string;
  unidade_curricular: string;
  docente: string;
  pk_afectacao: number | null;
};

/* ---------- RESPONSE ---------- */
export type ListDocentesRegentesResponse = {
  data: DocenteRegente[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- PARAMS ---------- */
export type ListDocentesRegentesParams = {
  page?: number;
  limit?: number;
  ano_lectivo?: number;
  curso?: number;
  classe?: number;
  semestre?: number;
  estado?: number;
  search?: string;
};

/* ---------- SERVICE ---------- */
export async function listDocentesRegentesService(
  params: ListDocentesRegentesParams
): Promise<ListDocentesRegentesResponse> {
  const { data } = await axiosNestGa.get<ListDocentesRegentesResponse>(
    "/docente-gestao/regentes",
    {
      params,
    }
  );

  return data;
}