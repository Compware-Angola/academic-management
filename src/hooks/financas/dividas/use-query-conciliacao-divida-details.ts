import {
  ConciliationDetails,
  getConciliationDetails,
} from "@/services/financas/conciliacao-divida/fetch-conciliacao-divida";
import { useQuery } from "@tanstack/react-query";

export const useConciliationDetails = (id?: number) => {
  return useQuery<ConciliationDetails>({
    queryKey: ["conciliation-details", id],
    queryFn: () => getConciliationDetails(id!),
    enabled: !!id,
  });
};
