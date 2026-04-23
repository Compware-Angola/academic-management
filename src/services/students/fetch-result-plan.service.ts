import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ResultPlanItem = {
  codigo: number;
  nota: number;
  codigo_disciplina: number;
  disciplina: string;
  codigo_classe: number;
  classe: string;
  duracao: string;
  semestre: string;
};

export type ResultPlanResponse = {
  grades: ResultPlanItem[];
  totalGradesCurso: number;
  totalGrasesAluno: number;
};

export async function getResultPlanService(
  codigoMatricula: number,
): Promise<ResultPlanResponse> {
  const { data } = await axiosNestGa.get<ResultPlanResponse>(
    `/students/resultado-plano/${codigoMatricula}`,
  );

  return data;
}
