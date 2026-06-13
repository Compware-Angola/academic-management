import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdateOralCurricularUnitStatusResponse = {
  message: string;
  data: {
    curricularGradeId: number;
    oralEnabled: boolean;
    updatedById: number;
  };
};

type UpdateOralCurricularUnitStatusParams = {
  curricularGradeId: number;
  enabled: boolean;
};

export async function updateOralCurricularUnitStatus({
  curricularGradeId,
  enabled,
}: UpdateOralCurricularUnitStatusParams): Promise<UpdateOralCurricularUnitStatusResponse> {
  const { data } =
    await axiosNestGa.patch<UpdateOralCurricularUnitStatusResponse>(
      `/post-graduation/assessments/oral-curricular-units/${curricularGradeId}/status`,
      { enabled },
    );

  return data;
}
