import { ListagemGeralEstudantesParams, ListagemGeralEstudantesResponse, ListagemGeralEstudantesService } from "@/services/enrollment/fetch-listagem-geral-estudantes";
import { useQuery } from "@tanstack/react-query";


export function useQueryListagemGeralEstudantes(
  params: ListagemGeralEstudantesParams
) {
  return useQuery<ListagemGeralEstudantesResponse>({
    queryKey: [
      "listagem-geral-estudantes",
      params.page,
      params.limit,
      params.anoLectivo,
      params.faculdade,
      params.grauAcademico,
      params.curso,
      params.anoCurricular,
      params.periodo,
      params.nacionalidade,
      params.necessidade,
      params.sexo,
      params.search,
    ],
    queryFn: () => ListagemGeralEstudantesService(params),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}