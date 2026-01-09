import {
  createLogsParams,
  fetchLogsAccessos,
  LogsPaginatedResponse,
  tipoLogsAccesses,
} from "@/services/access/fetch-logs-acesses.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../use-auth";

export function useQueryLogsAccesses(params?: createLogsParams) {
  const {
    user: {
      user: { pk_utilizador },
    },
  } = useAuth();

  return useQuery<LogsPaginatedResponse, Error>({
    queryKey: ["logs-accesses", params],
    queryFn: () => fetchLogsAccessos(pk_utilizador, params as createLogsParams),
    enabled: !!params,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
