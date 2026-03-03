import { statusAgendamentoService } from "@/services/assiduidade/fetch-assiduidade.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryStatusAgendamento = (
  options?: {
    enabled?: boolean;
  },
) => {
  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<{ codigo: number; designacao: string }[]>({
    queryKey: ["status-agendamento"],
    queryFn: statusAgendamentoService,
    enabled,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};