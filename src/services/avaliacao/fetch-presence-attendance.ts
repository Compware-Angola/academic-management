import { axiosNestGa } from "@/lib/axios-nest-ga";

export type MesPago = {
  mes_temp_id: number;
  factura: number;
};

export type PresencaApiItem = {
  numero_matricula: number;
  nome: string;
  is_bolseiro: number;
  mes_pago: number;
  periodo: string;
  curso: string;
  classe: string;
};

export type ProvaInfo = {
  codigo_disciplina: number;
  uc: string;
  tipo_prova: string;
  tipo_avaliacao: string;
  tipo_avaliacao_sigla: string;
  data_prova: string;
  hora_prova: string;
  hora_termino: string;
  duracao_prova: string;
};

export type PresencaEstudante = {
  prova: ProvaInfo | null;
  data: PresencaApiItem[];
  page: number;
  limit: number;
  hasNextPage: boolean;
};
export type PresencaQuery = {
  anoLectivo: number;
  horarioPk: number;
  semestre: number;
  situacao_financeira: number;
  codigoMatricula: number;
  nome: string;
  tipo_avaliacao: number; // filtra por FK2_TB_TIPO_AVALIACAO.CODIGO (via REF_PRAZO.pk_tipoAvalicao)
  page?: number;
  limit?: number;
};

export type PresencaExport = {
  prova: ProvaInfo | null;
  data: PresencaApiItem[];
};

export async function getPresenceAttendanceService(
  params: PresencaQuery,
): Promise<PresencaEstudante> {
  const { data } = await axiosNestGa.get<PresencaEstudante>(
    "/assessment/list-presence-attendance",
    { params },
  );

  return data;
}

export type PresencaExportQuery = Omit<PresencaQuery, "page" | "limit">;

export async function exportPresenceAttendanceService(
  params: PresencaExportQuery,
): Promise<PresencaExport> {
  const { data } = await axiosNestGa.get<PresencaExport>(
    "/assessment/export-presence-attendance",
    { params },
  );

  return data;
}
