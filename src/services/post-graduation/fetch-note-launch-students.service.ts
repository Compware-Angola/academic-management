import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationNoteLaunchContext = {
  academicYearId: number;
  academicYear: string;
  degreeId: number;
  degree: string;
  semesterId: number;
  semester: string;
  periodId: number;
  period: string;
  courseId: number;
  course: string;
  curricularYearId: number;
  curricularYear: string;
  curricularGradeId: number;
  curricularUnitId: number;
  curricularUnit: string;
  scheduleId: number;
  schedule: string;
  examTypeId: number;
  examType: string;
  assessmentTypeId: number;
  assessmentType: string;
};

export type PostGraduationStudentNote = {
  id: number | null;
  grade: number | null;
  observation: string | null;
  status: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type PostGraduationNoteLaunchStudent = {
  studentCurricularGradeId: number;
  enrollmentId: number;
  fullName: string;
  academicStatusId: number;
  academicStatus: string;
  note: PostGraduationStudentNote;
};

export type FetchNoteLaunchStudentsParams = {
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  periodId: number;
  courseId: number;
  curricularYearId: number;
  curricularGradeId: number;
  scheduleId: number;
  examTypeId: number;
  assessmentTypeId: number;
  search?: string;
  page: number;
  limit: number;
};

export type FetchNoteLaunchStudentsResponse = {
  context: PostGraduationNoteLaunchContext;
  data: PostGraduationNoteLaunchStudent[];
  summary: {
    total: number;
    withGrade: number;
    withoutGrade: number;
  };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchNoteLaunchStudents(
  params: FetchNoteLaunchStudentsParams,
): Promise<FetchNoteLaunchStudentsResponse> {
  const { data } =
    await axiosNestGa.get<FetchNoteLaunchStudentsResponse>(
      "/post-graduation/assessments/note-launch/students",
      {
        params: {
          ...params,
          search: params.search?.trim() || undefined,
        },
      },
    );

  return data;
}