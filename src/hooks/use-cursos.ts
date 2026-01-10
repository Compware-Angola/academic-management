import { Curso, getCursosDropdown } from "@/services/fetch-course";
import { useQuery } from "@tanstack/react-query";

export function useCursos() {
  return useQuery<Curso[], Error>({
    queryKey: ["cursos"],
    queryFn: getCursosDropdown,
    staleTime: 1000 * 60 * 60,
  });
}
