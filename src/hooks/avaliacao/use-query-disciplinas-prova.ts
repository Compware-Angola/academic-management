import { DisciplinaProva, fetchDisciplinasProva, FilterDisciplinaProvaParams } from "@/services/avaliacao/fetch-disciplinas-prova";
import { useQuery } from "@tanstack/react-query";


export function useQueryDisciplinasProva(
  params: FilterDisciplinaProvaParams = {}
) {

  const enabled =
    !!params.gradeSelecionada &&
    !!params.cursoSelecionado &&
    !!params.anoCurricularSelecionado &&
    !!params.semestreSelecionado &&
    !!params.anoLectivoSelecionado &&
    !!params.tipoProvaSelecionada &&
    !!params.tipoAvaliacaoSelecionada;

  return useQuery<DisciplinaProva[], Error>({
    queryKey: [
      "disciplinas-prova",
      params.verHorario,
      params.gradeSelecionada,
      params.cursoSelecionado,
      params.anoCurricularSelecionado,
      params.semestreSelecionado,
      params.anoLectivoSelecionado,
      params.tipoProvaSelecionada,
      params.tipoAvaliacaoSelecionada,
      params.filtro
    ],

    queryFn: async () => {
      if (!enabled) return [];
      return fetchDisciplinasProva(params);
    },

    enabled,
    retry:0,
    staleTime: 5 * 60 * 1000,
  });
}
