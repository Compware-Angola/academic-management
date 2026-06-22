import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CreatePostGraduationAgendaLaunchPayload = {
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  courseId: number;
  curricularYearId: number;
  curricularGradeId: number;
  termId: number;
  assessmentTypeId: number;
  fileName: string;
};

export type CreatePostGraduationAgendaLaunchResponse = {
  message: string;
  data: {
    id: number;
  };
};

export async function createPostGraduationAgendaLaunch(
  payload: CreatePostGraduationAgendaLaunchPayload,
): Promise<CreatePostGraduationAgendaLaunchResponse> {
  const { data } =
    await axiosNestGa.post<CreatePostGraduationAgendaLaunchResponse>(
      "/post-graduation/assessments/agenda-launch",
      payload,
    );

  return data;
}
