import { useQuery } from "@tanstack/react-query";
import {
  EstudanteFinalistaPayload,
  EstudanteFinalistaResponse,
  getEstudanteFinalistaService,
} from "@/services/defesa-tfc/estudante-finalista-tff.service";

export const useQueryEstudanteFinalista = (
  filters: EstudanteFinalistaPayload,
  options?: {
    enabled?: boolean;
  },
) => {
  const {
    anoLectivo,
    curso,
    tipoCandidatura,
    page = 1,
    limit = 10,
  } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<EstudanteFinalistaResponse>({
    queryKey: [
      "estudante-finalista",
      {
        anoLectivo,
        curso,
        tipoCandidatura,
        page,
        limit,
      },
    ],
    queryFn: () => getEstudanteFinalistaService(filters),
    enabled,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10, 
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};