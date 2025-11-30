import { fetchTipoProva, TipoProva } from "@/services/avaliacao/tipo-prova";
import { useQuery } from "@tanstack/react-query";


export function useQueryTipoProva() {
  return useQuery<TipoProva[], Error>({
    queryKey: ["tipo-prova"],
    queryFn: fetchTipoProva,
   staleTime: 5 * 60 * 1000,

  });
}
