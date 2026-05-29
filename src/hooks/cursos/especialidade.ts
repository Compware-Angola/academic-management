import { useQuery } from "@tanstack/react-query";
import { getCursoEspecialidadePorCodigoMatricula } from "@/services/cursos/curso-especialidade.service";

export function useCursoEspecialidadePorCodigoMatricula(
  codigoMatricula: number,
) {
  return useQuery({
    queryKey: ["curso-especialidade", codigoMatricula],
    queryFn: () => getCursoEspecialidadePorCodigoMatricula(codigoMatricula),
    staleTime: 5 * 60 * 1000,
    enabled: !!codigoMatricula,
  });
}
