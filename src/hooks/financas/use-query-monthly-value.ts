// hooks/use-query-monthly-fees-value.ts

import {
  MonthlyFeesValueParams,
  getMonthlyFeesValue,
} from "@/services/financas/fetch-monthly-value.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryMonthlyFeesValue(params: MonthlyFeesValueParams) {
  return useQuery({
    queryKey: [
      "monthly-fees-value",
      params.anoLectivoId,
      params.cursoId,
      params.poloId,
    ],
    queryFn: () => getMonthlyFeesValue(params),
    enabled: !!params.anoLectivoId && !!params.cursoId && !!params.poloId,
  });
}
