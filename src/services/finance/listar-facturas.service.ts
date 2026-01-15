// src/services/factura/listar-facturas.service.ts

import { axiosNestFinance } from "@/lib/axios-nest-finance";
import { normalizeParam } from "@/util/normalize-param";

export type ListarFacturasPayload = {
  search?: string | number;
  anoLectivo?: number | string;
  status?:number | null
  page?: number;
  limit?: number;
};

/* ---------- RESPONSE ITEM ---------- */
export type Factura = {
  codigo: number;
  data_factura: string;
  total_preco: number;
  codigo_matricula: number;
  referencia: string;
  descricao: string;
  estado: number;
  nome_aluno: string;
  curso: string;
  polo: string;
  rn: number;
};

/* ---------- RESPONSE COMPLETO ---------- */
export type ListarFacturasResponse = {
  data: Factura[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function listarFacturasService(
  payload: ListarFacturasPayload
): Promise<ListarFacturasResponse> {
  const { search, anoLectivo, page = 1, limit = 25 ,status} = payload;

  const params = {
    search: normalizeParam(search),
    anoLectivo: normalizeParam(anoLectivo),
    status:status,
    page,
    limit,
  };

  const { data } = await axiosNestFinance.get<ListarFacturasResponse>(
    "/invoices",
    { params }
  );

  return data;
}
