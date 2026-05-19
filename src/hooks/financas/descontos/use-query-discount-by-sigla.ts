// hooks/use-query-discount-by-sigla.ts

import { getDiscountBySigla } from "@/services/financas/descontos/fetch-discount-by-sigla.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryDiscountBySigla(sigla: string) {
  return useQuery({
    queryKey: ["discount-by-sigla", sigla],
    queryFn: () => getDiscountBySigla(sigla),
    enabled: !!sigla,
  });
}
