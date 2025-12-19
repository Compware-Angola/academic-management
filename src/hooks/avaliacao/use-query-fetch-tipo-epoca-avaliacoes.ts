import { fetchTipoEpocaAvaliacoes } from "@/services/avaliacao/fetchTipoEpocaAvaliacoes";
import { useQuery } from "@tanstack/react-query";

export function useQueryTipoEpocaAvaliacoes() {
  return useQuery({
    queryKey: ["tipo-epoca-avaliacao"],
    queryFn: fetchTipoEpocaAvaliacoes,
    staleTime: 5 * 60 * 1000,
  });
}
