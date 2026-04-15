import { ColisaoIsentaCursoItem, ColisaoIsentaMatriculaItem, FetchColisoesIsentasCursosParams, fetchColisoesIsentasCursosService, FetchColisoesIsentasMatriculasParams, fetchColisoesIsentasMatriculasService, PaginatedResponse } from "@/services/registrations/fetch-colisoes-isentas.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryColisoesIsentasMatriculas(
  params: FetchColisoesIsentasMatriculasParams
) {
  return useQuery<PaginatedResponse<ColisaoIsentaMatriculaItem>>({
    queryKey: ["colisoes-isentas-matriculas", params],
    queryFn: () => fetchColisoesIsentasMatriculasService(params),
  });
}

export function useQueryColisoesIsentasCursos(
  params: FetchColisoesIsentasCursosParams
) {
  return useQuery<PaginatedResponse<ColisaoIsentaCursoItem>>({
    queryKey: ["colisoes-isentas-cursos", params],
    queryFn: () => fetchColisoesIsentasCursosService(params),
  });
}