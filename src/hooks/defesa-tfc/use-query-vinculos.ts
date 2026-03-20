import { getVinculosService, VinculosPayload, VinculosResponse } from "@/services/defesa-tfc/viculos.service";
import { useQuery } from "@tanstack/react-query";


export const useQueryVinculos = (filters: VinculosPayload) => {
  return useQuery<VinculosResponse>({
    queryKey: ["vinculos", filters],
    queryFn: () => getVinculosService(filters),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};