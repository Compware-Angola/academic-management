import { useQuery } from "@tanstack/react-query";
import {
  getCursoBasePorCodigoMatricula,
  getCursoEspecialidadePorCodigoMatricula,
} from "@/services/cursos/curso-especialidade.service";

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

export function useCursoBasePorCodigoMatricula(codigoMatricula: number) {
  return useQuery({
    queryKey: ["curso-base", codigoMatricula],
    queryFn: () => getCursoBasePorCodigoMatricula(codigoMatricula),
    staleTime: 5 * 60 * 1000,
    enabled: !!codigoMatricula,
  });
}
