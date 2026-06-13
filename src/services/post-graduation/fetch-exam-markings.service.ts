import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationExamMarking = {
  id: number;
  courseId: number;
  course: string;
  curricularGradeId: number;
  curricularUnitId: number;
  curricularUnit: string;
  scheduleId: number;
  schedule: string;
  termId: number;
  assessmentType: string | null;
  examTypeId: number | null;
  examType: string | null;
  modalityId: number | null;
  modality: string | null;
  roomId: number | null;
  room: string | null;
  periodId: number | null;
  period: string | null;
  examDate: string;
  startTime: string;
  endTime: string;
  status: number | null;
  createdById: number | null;
  createdBy: string | null;
  invigilators: Array<{
    id: number;
    name: string;
  }>;
};

export type FetchExamMarkingsParams = {
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  courseId?: number;
  termId?: number;
  page: number;
  limit: number;
};

export type FetchExamMarkingsResponse = {
  data: PostGraduationExamMarking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchExamMarkings(
  params: FetchExamMarkingsParams,
): Promise<FetchExamMarkingsResponse> {
  const { data } = await axiosNestGa.get<FetchExamMarkingsResponse>(
    "/post-graduation/assessments/exam-markings",
    { params },
  );

  return data;
}
