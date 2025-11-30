import { useQuery } from "@tanstack/react-query";
import { listarHorariosExistentesService, ListarHorariosExistentesPayload } from "@/services/horario/listar-horarios-existentes.service";

export const useQueryHorariosExistentes = (filters: ListarHorariosExistentesPayload) => {
  const enabled = !!filters.p_ano_lectivo && !!filters.p_semestre && !!filters.p_periodo && !!filters.p_curso;

  return useQuery({
    queryKey: ["horarios-existentes", filters],
    queryFn: () => listarHorariosExistentesService(filters),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
};