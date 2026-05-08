import {
  getEstatisticasPagamentoService,
  EstatisticasPagamentoPayload,
} from "@/services/finance/estatisticas-pagamento.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryEstatisticasPagamento = (
  filters?: EstatisticasPagamentoPayload,
  enabled?: boolean,
) => {
  return useQuery({
    queryKey: ["estatisticas-pagamento", filters],
    queryFn: () => getEstatisticasPagamentoService(filters!),
    enabled: enabled && !!filters?.dataInicio && !!filters?.dataFim,
    staleTime: 1000 * 60 * 5,
  });
};
