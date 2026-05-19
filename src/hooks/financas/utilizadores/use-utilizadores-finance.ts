import {
  listUtilizadoresService,
  ListUtilizadoresFilters,
} from "@/services/financas/utilizadores/financa-utilizadores.service";
import { useQuery } from "@tanstack/react-query";

export function useUtilizadoresFinance(filters?: ListUtilizadoresFilters) {
  return useQuery({
    queryKey: ["utilizadores-finance", filters],
    queryFn: () => listUtilizadoresService(filters),
  });
}
