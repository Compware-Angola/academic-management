// src/services/horario/listar-horarios-existentes.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";
import { normalizeParam } from "@/util/normalize-param";

export type ListarHorariosExistentesPayload = {
  anoLectivo: number | string;
  semestre: number | string;
  periodo: number | string;
  curso: number | string;
  anoCurricular?: number | string;
  unidadeCurricular?: number | string;
  estado?: number | string;
  afetacaoDocente?: number | string;
  page?: number;
  limit?: number;
};

/* ---------- RESPONSE ITEM ---------- */
export type HorarioExistente = {
  codigo: number;
  designacao: string;
  unidadeCurricularId: number;
  unidadecurricular: string;
  curso: string;
  ano: string;
  capacidade: number;
  reservado: string;
  semestre: string;
  estado: string;
  estadoid: number;
  estadocor: string | null;
  disponibilidade: string;
  criadoPor: string | null;
  atualizadoPor: string | null;
  dataUltimaAtualizacao: string;
  datacriacao: string;
};

/* ---------- RESPONSE COMPLETO ---------- */
export type ListarHorariosExistentesResponse = {
  data: HorarioExistente[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function listarHorariosExistentesService(
  payload: ListarHorariosExistentesPayload
): Promise<ListarHorariosExistentesResponse> {
  const {
    anoLectivo,
    semestre,
    periodo,
    curso,
    anoCurricular,
    unidadeCurricular,
    estado,
    afetacaoDocente,
    page = 1,
    limit = 25,
  } = payload;

  const params = {
    anoLectivo: normalizeParam(anoLectivo),
    semestre: normalizeParam(semestre),
    periodo: normalizeParam(periodo),
    curso: normalizeParam(curso),
    anoCurricular: normalizeParam(anoCurricular),
    unidadeCurricular: normalizeParam(unidadeCurricular),
    estado: normalizeParam(estado),
    afetacaoDocente: normalizeParam(afetacaoDocente),
    page,
    limit,
  };

  const { data } = await axiosNestGa.get<ListarHorariosExistentesResponse>(
    "/schedule",
    { params }
  );

  return data;
}
