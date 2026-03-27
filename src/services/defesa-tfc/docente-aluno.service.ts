import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DocenteAlunoPayload = {
  docenteId: number;
  anoLectivoId: number;
};

export type Orientando = {
  nome_aluno: string;
  curso: string;
  tema: string;
  matricula: number;
  data_atribuicao: string;
};

export type DocenteAlunoResponse = {
  alunos: Orientando[];
};

export async function getDocenteAlunoService(payload: DocenteAlunoPayload) {
  const { data } = await axiosNestGa.get<DocenteAlunoResponse>(
    `defense-management-tfc/orientadores/${payload.docenteId}/alunos?anoLectivoId=${payload.anoLectivoId}`,
  );

  return data;
}