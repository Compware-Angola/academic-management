import { useQuery } from "@tanstack/react-query";
import { getCursoEspecialidade } from "@/services/cursos/curso-especialidade.service";

export function useCursoEspecialidade(cursoId: number) {
  return useQuery({
    queryKey: ["curso-especialidade", cursoId],
    queryFn: () => getCursoEspecialidade(cursoId),
    staleTime: 5 * 60 * 1000,
    enabled: !!cursoId,
  });
}