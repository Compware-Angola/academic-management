import { fetchTipoAvaliacao,TipoAvaliacao } from "@/services/avaliacao/tipo-avaliacao";
import { useQuery } from "@tanstack/react-query";


export function useQueryTipoAvaliacao() {
  return useQuery<TipoAvaliacao[], Error>({
    queryKey: ["tipo-avaliacao"],
    queryFn: fetchTipoAvaliacao,
   staleTime: 5 * 60 * 1000,

  });
}
