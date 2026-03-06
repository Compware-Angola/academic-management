import {
  ListHorariosVigilantePayload,
  ListHorariosVigilanteResponse,
  getHorariosVigilanteService,
} from "@/services/docentes/horas-vigilantes.service";
import { useQuery } from "@tanstack/react-query";

interface QueryHorariosVigilante {
  enabled?: boolean;
}

export function useQueryHorariosVigilante(
  payload: ListHorariosVigilantePayload,
  options?: QueryHorariosVigilante,
) {
  const { vigilanteId, prazoId, periodoId, estado, limit, page } = payload;
  const defaultEnabled = !!vigilanteId && !!prazoId;

  return useQuery<ListHorariosVigilanteResponse>({
    queryKey: [
      "horarios-vigilantes",
      vigilanteId,
      prazoId,
      periodoId,
      estado,
      limit,
      page,
    ],
    queryFn: () => getHorariosVigilanteService(payload),
    enabled: options?.enabled ?? defaultEnabled,
  });
}
