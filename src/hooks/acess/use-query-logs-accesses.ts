import {
  createLogsParams,
  fetchLogsAccessos,
  LogsPaginatedResponse,
} from "@/services/access/fetch-logs-acesses.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../use-auth";

export function useQueryLogsAccesses(params?: createLogsParams) {
  const { user } = useAuth();


  return useQuery<LogsPaginatedResponse, Error>({
    queryKey: ["logs-accesses", params],
    queryFn: () =>
      fetchLogsAccessos( params as createLogsParams),
    // A query SÓ executa se houver usuário E parâmetros
    enabled: !!params,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
