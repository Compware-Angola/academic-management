import { axiosNestGa } from "@/lib/axios-nest-ga";


export type DisciplinaProva = {
  disciplina: string;
  turmaOuHorario: string;
  semestre: string;
  cor: string | null;
  codigoTurmaHorario: number;
  codigoGrade: number;
  numeroDeIscritos: number;
  numNotaPorLancar: number;
  numNotaLancada: number;
};


export type FilterDisciplinaProvaParams = {
  verHorario?: boolean;
  gradeSelecionada?: number;
  cursoSelecionado?: number;
  anoCurricularSelecionado?: number;
  semestreSelecionado?: number;
  anoLectivoSelecionado?: number;
  tipoProvaSelecionada?: number;
  tipoAvaliacaoSelecionada?: number;
  filtro?:number
};


export async function fetchDisciplinasProva(
  params: FilterDisciplinaProvaParams
): Promise<DisciplinaProva[]> {
  const { data } = await axiosNestGa.get(
    "assessment/disciplinas-prova",
    {
      params,
    }
  );


  return data ?? [];
}
