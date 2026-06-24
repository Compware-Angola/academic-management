import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationNoteLaunchOption = {
  id: number;
  designation: string;
};

export type PostGraduationNoteLaunchOptions = {
  courses: PostGraduationNoteLaunchOption[];
  curricularYears: Array<{
    id: number;
    designation: string;
    courseId: number;
  }>;
  curricularUnits: Array<{
    curricularGradeId: number;
    curricularUnitId: number;
    designation: string;
    courseId: number;
    curricularYearId: number;
  }>;
  schedules: Array<{
    id: number;
    designation: string;
    courseId: number;
    curricularYearId: number;
    curricularGradeId: number;
    periodId: number;
  }>;
  periods: PostGraduationNoteLaunchOption[];
  assessmentTypes: Array<{
    id: number;
    designation: string;
    code: string | null;
  }>;
  examTypes: PostGraduationNoteLaunchOption[];
};

export type FetchNoteLaunchOptionsParams = {
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  courseId?: number;
};

export type FetchNoteLaunchOptionsResponse = {
  data: PostGraduationNoteLaunchOptions;
};

export async function fetchNoteLaunchOptions(
  params: FetchNoteLaunchOptionsParams,
): Promise<FetchNoteLaunchOptionsResponse> {
  const { data } =
    await axiosNestGa.get<FetchNoteLaunchOptionsResponse>(
      "/post-graduation/assessments/note-launch/options",
      { params },
    );

  return data;
}