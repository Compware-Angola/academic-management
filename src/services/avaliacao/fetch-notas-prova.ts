import { axiosNestGa } from "@/lib/axios-nest-ga";
export type NotaAlunoApi = {
  alunoId: number;
  alunoNome: string;
  numeroAluno: number;
  nota: number;
  dataLancamento: string;
};


type Params = {
  turmaOuHorarioId: number;
  tipoAvaliacaoId: number;
  anoLectivoId: number;
};

export async function fetchNotasProva(params: Params): Promise<NotaAlunoApi[]> {

  const { data } = await axiosNestGa.get(
    "/assessment/notas",
    { params }
  );


  return data ?? [];
}
