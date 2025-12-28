import { axiosNestGa } from "@/lib/axios-nest-ga";
type TeamOldRulesParams = {
  turma: string;
  anoLectivo: string;
  semestre: string;
};
type TeamOldRulesResponse = {
  code_ano_lectivo: number;
  grade_curricular: number;
  unidade_curricular: string;
};
export async function teamOldRules(params: TeamOldRulesParams) {
  const { data } = await axiosNestGa.get<TeamOldRulesResponse[]>(
    "team-old-rules",
    { params }
  );
  return data;
}

type TeamOldRulesTurmasParams = {
  curso: string;
  anoLectivo: string;
  classe: string;
  periodo: string;
};
type TeamOldRulesTurmasResponse = { codigo: number; designacao: string };
export async function teamOldRulesTurmas(params: TeamOldRulesTurmasParams) {
  const { data } = await axiosNestGa.get<TeamOldRulesTurmasResponse[]>(
    "team-old-rules/turmas",
    {
      params,
    }
  );
  return data;
}
