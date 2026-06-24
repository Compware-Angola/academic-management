import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationAttendanceContext = {
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
};

export type PostGraduationAttendanceStudent = {
  number: number;
  enrollmentId: number;
  fullName: string;
  academicStatus: string;
};

export type FetchAttendanceListParams = {
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  periodId: number;
  courseId: number;
  curricularYearId: number;
  curricularGradeId: number;
  scheduleId: number;
  search?: string;
  page: number;
  limit: number;
};

export type FetchAttendanceListResponse = {
  context: PostGraduationAttendanceContext;
  data: PostGraduationAttendanceStudent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchAttendanceList(
  params: FetchAttendanceListParams,
): Promise<FetchAttendanceListResponse> {
  const { data } = await axiosNestGa.get<FetchAttendanceListResponse>(
    "/post-graduation/assessments/attendance-list",
    { params },
  );

  return data;
}
