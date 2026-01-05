import { useQuery } from "@tanstack/react-query";
import {
  listarHorariosExistentesService,
  ListarHorariosExistentesPayload,
} from "@/services/horario/listar-horarios-existentes.service";

export const useQueryHorariosExistentes = (
  filters: ListarHorariosExistentesPayload
) => {
  const enabled = !!filters.anoLectivo;

  return useQuery({
    queryKey: ["horarios-existentes", filters],
    queryFn: () => listarHorariosExistentesService(filters),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
};
