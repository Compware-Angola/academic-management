import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CreatePostGraduationExamMarkingPayload = {
  degreeId: number;
  academicYearId: number;
  semesterId: number;
  courseId: number;
  curricularGradeId: number;
  scheduleId: number;
  termId: number;
  examTypeId: number;
  modalityId: number;
  roomId: number;
  periodId: number;
  examDate: string;
  startTime: string;
  endTime: string;
  invigilatorUserIds: number[];
};

export type CreatePostGraduationExamMarkingResponse = {
  message: string;
  data: {
    id: number;
  };
};

export async function createPostGraduationExamMarking(
  payload: CreatePostGraduationExamMarkingPayload,
): Promise<CreatePostGraduationExamMarkingResponse> {
  const { data } =
    await axiosNestGa.post<CreatePostGraduationExamMarkingResponse>(
      "/post-graduation/assessments/exam-markings",
      payload,
    );

  return data;
}
