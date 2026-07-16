import { axiosNestGa } from "@/lib/axios-nest-ga";

export type createLogsParams = {
  dataInicio?: string;
  dataFim?: string;
  search?: string;
  page: number;
  limit: number;
};

export type LogsAccesses = {
  pkLogAcesso: number;
  descricao: string;
  fkAcesso: number | null;
  fkFuncionalidade: number | null;
  fkUtilizadorResponsavel: number;
  fkGrupoAfetado: number | null;
  fkOperacaoLog: number;
  createdAt: string;
  ip: string;

  nomeUtilizadorResponsavel?: string;
  codigoUtilizador?: number;
  nomeFuncionalidade?: string | null;
  designacaoAcesso?: string | null;
};

export type LogsPaginatedResponse = {
  data: LogsAccesses[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchLogsAccessos(
  params: createLogsParams,
): Promise<LogsPaginatedResponse> {
  const _params = { ...params };

  const { data } = await axiosNestGa.get(
    "/acess_management/logs-acessos-funcionalidade",
    { params: _params },
  );

  return data;
}
