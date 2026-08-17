import { axiosNestAudit } from "@/lib/axios-nest-audit";

export type LogOutcome = "SUCCESS" | "FAILURE" | "ERROR";

export type TargetResource = {
  type: string;
  id: string;
};

export type LogAudit = {
  _id: string;
  serviceName: string;
  module: string;
  action: string;
  actionDescription?: string;
  targetResource?: TargetResource;
  outcome: LogOutcome;
  outcomeDetail?: string;
  timestamp: string;
  statusCode?: number;
  responseTimeMs?: number;
  userId?: string;
  userName?: string;
  ip?: string;
  requestId: string;
  method?: string;
  path?: string;
};

export type fetchLogsParams = {
  dataInicio?: string;
  dataFim?: string;
  search?: string;
  serviceName?: string;
  module?: string;
  action?: string;
  outcome?: LogOutcome;
  utilizadorId?: string;
  page: number;
  limit: number;
};

export type LogsPaginatedResponse = {
  data: LogAudit[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchLogsAccessos(
  params: fetchLogsParams,
): Promise<LogsPaginatedResponse> {
  const _params = { ...params };

  const { data } = await axiosNestAudit.get("/audit", {
    params: _params,
  });

  return data;
}

export type LogsFilterOptions = {
  serviceNames: string[];
  modules: string[];
  actions: string[];
};

export async function fetchLogsFilterOptions(): Promise<LogsFilterOptions> {
  const { data } = await axiosNestAudit.get("/audit/filters");

  return data;
}
