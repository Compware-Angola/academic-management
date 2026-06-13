import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ExamMarkingOption = {
  id: number;
  designation: string;
};

export type PostGraduationExamMarkingOptions = {
  courses: ExamMarkingOption[];
  curricularUnits: Array<{
    curricularGradeId: number;
    curricularUnitId: number;
    designation: string;
    courseId: number;
  }>;
  schedules: Array<{
    id: number;
    designation: string;
    courseId: number;
    curricularGradeId: number;
    periodId: number | null;
  }>;
  terms: Array<{
    id: number;
    assessmentTypeId: number | null;
    assessmentType: string | null;
    startDate: string;
    endDate: string;
    isOpen: boolean;
  }>;
  rooms: Array<ExamMarkingOption & { capacity: number | null }>;
  examTypes: ExamMarkingOption[];
  modalities: ExamMarkingOption[];
  periods: ExamMarkingOption[];
  invigilators: Array<{
    id: number;
    name: string;
  }>;
};

export type FetchExamMarkingOptionsParams = {
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  courseId?: number;
};

export type FetchExamMarkingOptionsResponse = {
  data: PostGraduationExamMarkingOptions;
};

export async function fetchExamMarkingOptions(
  params: FetchExamMarkingOptionsParams,
): Promise<FetchExamMarkingOptionsResponse> {
  const { data } =
    await axiosNestGa.get<FetchExamMarkingOptionsResponse>(
      "/post-graduation/assessments/exam-markings/options",
      { params },
    );

  return data;
}
