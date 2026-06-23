import { Curso, CursoParams, getCursosDropdown } from "@/services/fetch-course";
import { useQuery } from "@tanstack/react-query";

export function useCursos(params?: CursoParams) {
  return useQuery<Curso[], Error>({
    queryKey: ["cursos", params?.faculdadeId, params?.tipoCandidaturaId, params?.level],
    queryFn: () => getCursosDropdown(params),
    staleTime: 1000 * 60 * 60,
  });
}
