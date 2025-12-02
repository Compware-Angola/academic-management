

import { useQuery } from "@tanstack/react-query";
import {  ListarHorariosExistentesPayload } from "@/services/horario/listar-horarios-existentes.service";
import { listarHorariosExistentesEliminadosService } from "@/services/horario/listar-horarios-existentes-eliminado.service";

export const useQueryHorariosExistentesEliminados = (filters: ListarHorariosExistentesPayload) => {
  const enabled = !!filters.p_ano_lectivo &&
                  !!filters.p_semestre &&
                  !!filters.p_periodo &&
                  !!filters.p_curso;

  return useQuery({
    queryKey: ["horarios-existentes-eliminados", filters],
    queryFn: () => listarHorariosExistentesEliminadosService(filters),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};