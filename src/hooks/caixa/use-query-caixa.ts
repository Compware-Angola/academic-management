import { fetchCaixas } from "@/services/caixa/fetch-caixa.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryCaixas = () => {
  return useQuery({
    queryKey: ["caixas"],
    queryFn: fetchCaixas,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
};
