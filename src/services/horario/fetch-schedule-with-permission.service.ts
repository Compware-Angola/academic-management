import { axiosNestGa } from "@/lib/axios-nest-ga";

import { parseFilter } from "@/util/parse-filter";

/* =======================
 * PARAMS
 * ======================= */
export type ScheduleWIthPermissionParams = {
  anoLectivo: string;
  semestre?: string;
  periodo?: string;
  curso?: string;
  anoCurricular?: string;
  unidadeCurricular?: string;
  estado?: string;
  afetacaoDocente?: string;
  page?: number;
  limit?: number;
};
/* =======================
 * PERMISSAO
 * ======================= */
export type Permissao = {
  codigo: number;
  fkhorario: number;
  datainicio: string;
  datafim: string;
  ativo: number;
  codigoutilizador: string;
  utilizador: string;
};

/* =======================
 * SCHEDULE
 * ======================= */
export type ScheduleWithPermission = {
  codigo: number;
  designacao: string;
  unidadecurricularid: number;
  unidadecurricular: string;
  curso: string;
  ano: string;
  capacidade: number;
  reservado: string;
  semestre: string;
  estado: string;
  estadocor: any;
  estadoid: number;
  disponibilidade: string;
  criadopor: string;
  atualizadopor: string;
  dataultimaatualizacao: string;
  datacriacao: string;
};

/* =======================
 * SCHEDULE + PERMISSAO
 * ======================= */
export type ScheduleWithPermissao = ScheduleWithPermission & {
  permissao?: Permissao | null;
};

/* =======================
 * RESPONSE
 * ======================= */
export type ScheduleWithPermissaoResponse = {
  data: ScheduleWithPermissao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* =======================
 * FETCH
 * ======================= */
export const fetchScheduleWithSchedule = async (
  payload: ScheduleWIthPermissionParams
): Promise<ScheduleWithPermissaoResponse> => {
  const {
    anoLectivo,
    anoCurricular,
    curso,
    estado,
    afetacaoDocente,
    limit,
    page,
    periodo,
    semestre,
    unidadeCurricular,
  } = payload;
  const params = {
    anoLectivo: parseFilter(anoLectivo),
    semestre: parseFilter(semestre),
    periodo: parseFilter(periodo),
    curso: parseFilter(curso),
    anoCurricular: parseFilter(anoCurricular),
    unidadeCurricular: parseFilter(unidadeCurricular),
    estado: parseFilter(estado),
    afetacaoDocente: parseFilter(afetacaoDocente),
    page,
    limit,
  };

  const response = await axiosNestGa.get<ScheduleWithPermissaoResponse>(
    "/schedule/with-permission",
    {
      params: params,
    }
  );

  return response.data;
};
