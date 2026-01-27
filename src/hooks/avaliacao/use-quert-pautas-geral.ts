import { getPautasGeral } from "@/services/avaliacao/pautas-geral";
import { useQuery } from "@tanstack/react-query";

type PautasGeralParams = {
  anoLectivo?: string;
  gradeCurricular?: string;
  horario?: string;
  semestre?: string;
  gradeCurricularTurma?: string;
  turma?: string;

  page?: number;
  limit?: number;
};

export function usePautasGeral(
  params?: PautasGeralParams,
  enabled = false
) {
  return useQuery({
    queryKey: [
      "pautas-geral",
      params?.anoLectivo,
      params?.semestre,
      params?.gradeCurricular,
      params?.horario,
      params?.gradeCurricularTurma,
      params?.turma,
      params?.page,
      params?.limit,
    ],

    queryFn: () => {
      if (!params?.anoLectivo || !params?.semestre) {
        throw new Error("Parâmetros obrigatórios em falta");
      }

      return getPautasGeral({
        anoLectivo: params.anoLectivo,
        semestre: params.semestre,
        gradeCurricular: params.gradeCurricular,
        horario: params.horario,
        gradeCurricularTurma: params.gradeCurricularTurma,
        turma: params.turma,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      });
    },

    staleTime: 1000 * 60 * 5,
    enabled: Boolean(params?.anoLectivo && params?.semestre && enabled),
 
  });
}
