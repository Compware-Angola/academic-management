import { useQuery } from "@tanstack/react-query";
import { 
  fetchSumarioParametros, 
  ParametrosResponse 
} from "@/services/sumario/fetch-sumario-parametros.service";

export const useQuerySumarioParametros = () => {
  return useQuery<ParametrosResponse>({
    queryKey: ["sumario-parametros"],
    queryFn: fetchSumarioParametros,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};