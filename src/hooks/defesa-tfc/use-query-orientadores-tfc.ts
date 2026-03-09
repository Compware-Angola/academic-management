import { useQuery } from "@tanstack/react-query";
import {
  EstudanteFinalistaPayload,
  OrientadoresResponse,
  getOrientadoresService,
} from "@/services/defesa-tfc/orientadores-tff.service";

export const useQueryOrientadoresTFC = (
  filters: EstudanteFinalistaPayload,
  options?: {
    enabled?: boolean;
  },
) => {
  const {
    anoLectivoId, 
    cursoId,
    estado,
    page = 1,
    limit = 10,
  } = filters;



  return useQuery<OrientadoresResponse>({
    queryKey: [
      "orientadores-tfc",
      {
        anoLectivoId,
        cursoId,
        estado,
        page,
        limit,
      },
    ],
    queryFn: () => getOrientadoresService(filters),
  
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10, 
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};