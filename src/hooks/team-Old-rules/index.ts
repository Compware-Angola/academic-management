import {
  teamOldRules,
  teamOldRulesTurmas,
} from "@/services/team-old-rules/team-old-rules";
import { useQuery } from "@tanstack/react-query";
type TeamOldRulesParams = {
  turma?: string;
  anoLectivo?: string;
  semestre?: string;
};
export function useTeamOldRules(params?: TeamOldRulesParams) {
  return useQuery({
    queryKey: ["team-old-rules", params],
    queryFn: () =>
      teamOldRules({
        anoLectivo: params!.anoLectivo!,
        turma: params!.turma!,
        semestre: params!.semestre!,
      }),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(params?.anoLectivo && params?.semestre && params?.turma),
  });
}
type TeamOldRulesTurmasParams = {
  curso?: string;
  anoLectivo?: string;
  classe?: string;
  periodo?: string;
};
export function useTeamOldRulesTurmas(params?: TeamOldRulesTurmasParams) {
  return useQuery({
    queryKey: ["team-old-rules-turmas", params],
    queryFn: () =>
      teamOldRulesTurmas({
        anoLectivo: params!.anoLectivo!,
        classe: params!.classe!,
        periodo: params!.periodo!,
        curso: params.curso,
      }),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(
      params?.anoLectivo && params?.periodo && params?.classe && params.curso
    ),
  });
}
