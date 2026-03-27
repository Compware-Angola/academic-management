import { useQuery } from "@tanstack/react-query";
import { getDocenteAlunoService, DocenteAlunoPayload, DocenteAlunoResponse } from "@/services/defesa-tfc/docente-aluno.service";

export const useQueryDocenteAlunos = (filters: DocenteAlunoPayload) => {
  return useQuery<DocenteAlunoResponse>({  
    queryKey: ["docente-alunos", filters],
    queryFn: () => getDocenteAlunoService(filters),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!filters.docenteId && !!filters.anoLectivoId,
  });
};