import { fetchResultadosFinais, ResultadosFinaisParams } from "@/services/access_exam/resultados-finais.service";
import { useQuery } from "@tanstack/react-query";


export function useResultadosFinais(
  filters: ResultadosFinaisParams = {}, 
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["resultados-finais", filters],
    queryFn: () => fetchResultadosFinais(filters),
    enabled: options?.enabled ?? true,
  });
}