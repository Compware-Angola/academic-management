import { axiosNestGa } from "@/lib/axios-nest-ga";

/* =======================
 * PARAMS
 * ======================= */
export type ScheduleWIthPermissionParams = {
  anoLectivo: number;
  semestre?: number;
  periodo?: number;
  curso?: number;
  anoCurricular?: number;
  unidadeCurricular?: number;
  estado?: number;
  afetacaoDocente?: number;
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
  params: ScheduleWIthPermissionParams
): Promise<ScheduleWithPermissaoResponse> => {
  const queryParams = new URLSearchParams({
    anoLectivo: params.anoLectivo.toString(),
    page: (params.page || 1).toString(),
    limit: (params.limit || 25).toString(),
  });

  if (params.semestre !== undefined)
    queryParams.append("semestre", params.semestre.toString());
  if (params.periodo !== undefined)
    queryParams.append("periodo", params.periodo.toString());
  if (params.curso !== undefined)
    queryParams.append("curso", params.curso.toString());
  if (params.anoCurricular !== undefined)
    queryParams.append("anoCurricular", params.anoCurricular.toString());
  if (params.unidadeCurricular !== undefined)
    queryParams.append(
      "unidadeCurricular",
      params.unidadeCurricular.toString()
    );
  if (params.estado !== undefined)
    queryParams.append("estado", params.estado.toString());
  if (params.afetacaoDocente !== undefined)
    queryParams.append("afetacaoDocente", params.afetacaoDocente.toString());

  const response = await axiosNestGa.get<ScheduleWithPermissaoResponse>(
    "/schedule/with-permission",
    {
      params: queryParams,
    }
  );

  return response.data;
};
