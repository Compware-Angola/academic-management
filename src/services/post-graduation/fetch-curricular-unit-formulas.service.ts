import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationCurricularUnitFormula = {
  formulaId: number;
  curricularGradeId: number;
  curricularUnitId: number;
  curricularUnit: string;
  minimumPracticalGrade: number | null;
  practicalWeight: number | null;
  minimumFirstFrequencyGrade: number | null;
  firstFrequencyWeight: number | null;
  minimumSecondFrequencyGrade: number | null;
  secondFrequencyWeight: number | null;
  updatedById: number | null;
  updatedBy: string | null;
};

export type FetchCurricularUnitFormulasParams = {
  academicYearId: number;
  degreeId: number;
  courseId: number;
  curricularYearId: number;
  semesterId: number;
};

export type FetchCurricularUnitFormulasResponse = {
  data: PostGraduationCurricularUnitFormula[];
};

export async function fetchCurricularUnitFormulas(
  params: FetchCurricularUnitFormulasParams,
): Promise<FetchCurricularUnitFormulasResponse> {
  const { data } =
    await axiosNestGa.get<FetchCurricularUnitFormulasResponse>(
      "/post-graduation/assessments/formulas",
      { params },
    );

  return data;
}
