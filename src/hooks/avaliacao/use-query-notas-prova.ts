import { fetchNotasProva, NotaAlunoApi } from "@/services/avaliacao/fetch-notas-prova";
import { useQuery } from "@tanstack/react-query";


type Params = {
  turmaOuHorarioId?: number;
  tipoAvaliacaoId?: number;
  anoLectivoId?: number;
};

export function useQueryNotasProva(params: Params) {
  return useQuery<NotaAlunoApi[], Error>({
    queryKey: ["notas-prova", params],

    enabled:
      !!params.turmaOuHorarioId &&
      !!params.tipoAvaliacaoId &&
      !!params.anoLectivoId,

    queryFn: () =>
      fetchNotasProva({
        turmaOuHorarioId: params.turmaOuHorarioId!,
        tipoAvaliacaoId: params.tipoAvaliacaoId!,
        anoLectivoId: params.anoLectivoId!,
      }),

    staleTime: 5 * 60 * 1000,
  });
}
