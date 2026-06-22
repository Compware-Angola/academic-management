import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationOralCurricularUnit = {
  curricularGradeId: number;
  curricularUnitId: number;
  curricularUnit: string;
  oralEnabled: boolean;
  updatedById: number | null;
  updatedBy: string | null;
  updatedAt: string | null;
};

export type FetchOralCurricularUnitsParams = {
  academicYearId: number;
  degreeId: number;
  courseId: number;
  curricularYearId: number;
  semesterId: number;
};

export type FetchOralCurricularUnitsResponse = {
  data: PostGraduationOralCurricularUnit[];
};

export async function fetchOralCurricularUnits(
  params: FetchOralCurricularUnitsParams,
): Promise<FetchOralCurricularUnitsResponse> {
  const { data } =
    await axiosNestGa.get<FetchOralCurricularUnitsResponse>(
      "/post-graduation/assessments/oral-curricular-units",
      { params },
    );

  return data;
}
