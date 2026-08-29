import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface PlanoCurricularGrade {
  designacao: string;
  codigoPlano: number;
  codigoPlanoGrade: number;
  curso: string;
  temOral: boolean;
  disciplina: string;
  temPratica: boolean;
}

export interface FindPlanoCurricularGradeParams {
  codigoGrade: number;
  anoLetivo: number;
}

export async function findPlanoCurricularGrade({
  codigoGrade,
  anoLetivo,
}: FindPlanoCurricularGradeParams): Promise<PlanoCurricularGrade[]> {
  const { data } = await axiosNestGa.get<PlanoCurricularGrade[]>(
    "/discipline/plano-curricular-grade",
    {
      params: {
        codigoGradeCurricular: codigoGrade,
        codigoAnoLectivo: anoLetivo,
      },
    },
  );
  return data;
}
