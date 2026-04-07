import { useQuery } from "@tanstack/react-query";
import {
  listarDocenteSubstitutoService,
  ListarDocenteSubstitutoPayload,
} from "@/services/horario/listar-docente-substituto.service";

export const useQueryDocenteSubstituto = (
  filters: ListarDocenteSubstitutoPayload
) => {
  const enabled = !!filters.anoLectivo;

  return useQuery({
    queryKey: ["docente-substituto", filters],
    queryFn: () => listarDocenteSubstitutoService(filters),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};