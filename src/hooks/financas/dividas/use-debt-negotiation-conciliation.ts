import {
  DebtNegotiationDetailsConciliation,
  getDebtNegotiationDetailsConciliation,
} from "@/services/financas/conciliacao-divida";
import { useQuery } from "@tanstack/react-query";

export const useDebtNegotiationDetailsConciliation = (id?: number) => {
  return useQuery<DebtNegotiationDetailsConciliation>({
    queryKey: ["debt-negotiation-details", id],
    queryFn: () => getDebtNegotiationDetailsConciliation(id!),
    enabled: !!id,
  });
};
