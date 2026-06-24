import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdateCurricularUnitFormulaPayload = {
  minimumPracticalGrade: number;
  practicalWeight: number;
  minimumFirstFrequencyGrade: number;
  firstFrequencyWeight: number;
  minimumSecondFrequencyGrade: number;
  secondFrequencyWeight: number;
};

export type UpdateCurricularUnitFormulaResponse = {
  message: string;
  data: UpdateCurricularUnitFormulaPayload & {
    formulaId: number;
    updatedById: number;
  };
};

type UpdateCurricularUnitFormulaParams = {
  formulaId: number;
  payload: UpdateCurricularUnitFormulaPayload;
};

export async function updateCurricularUnitFormula({
  formulaId,
  payload,
}: UpdateCurricularUnitFormulaParams): Promise<UpdateCurricularUnitFormulaResponse> {
  const { data } =
    await axiosNestGa.put<UpdateCurricularUnitFormulaResponse>(
      `/post-graduation/assessments/formulas/${formulaId}`,
      payload,
    );

  return data;
}
