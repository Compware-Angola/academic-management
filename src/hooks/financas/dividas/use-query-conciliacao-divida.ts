import {
  ConciliacaoDividaFilters,
  getConciliacaoDividas,
} from "@/services/financas/conciliacao-divida/fetch-conciliacao-divida";
import { useQuery } from "@tanstack/react-query";

export const useQueryConciliacaoDividas = (
  filters: ConciliacaoDividaFilters = {},
) => {
  return useQuery({
    queryKey: ["conciliacao-dividas", filters],
    queryFn: () => getConciliacaoDividas(filters),
  });
};
