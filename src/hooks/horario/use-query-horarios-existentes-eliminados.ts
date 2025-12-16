import {
  ListarHorariosEliminadosPayload,
  listarHorariosEliminadosService,
} from "@/services/horario/listar-horarios-existentes-eliminado.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryHorariosEliminados = (
  filters: ListarHorariosEliminadosPayload
) => {
  const enabled = !!filters.anoLectivo;

  return useQuery({
    queryKey: ["horarios-eliminados", filters],
    queryFn: () => listarHorariosEliminadosService(filters),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
};
