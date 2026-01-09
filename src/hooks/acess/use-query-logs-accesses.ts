import {
  createLogsParams,
  fetchLogsAccessos,
  LogsPaginatedResponse,
} from "@/services/access/fetch-logs-acesses.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../use-auth";

export function useQueryLogsAccesses(params?: createLogsParams) {
  const { user } = useAuth();

  const pk_utilizador = user?.user?.pk_utilizador;

  return useQuery<LogsPaginatedResponse, Error>({
    queryKey: ["logs-accesses", pk_utilizador, params],
    queryFn: () =>
      fetchLogsAccessos(pk_utilizador!, params as createLogsParams),
    // A query SÓ executa se houver usuário E parâmetros
    enabled: !!pk_utilizador && !!params,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
