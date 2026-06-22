import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationAgendaLaunch = {
  id: number;
  createdAt: string;
  updatedAt: string;
  fileName: string;
  statusId: number;
  status: string | null;
  assessmentTypeId: number;
  assessmentType: string;
  academicYearId: number;
  academicYear: string;
  courseId: number;
  course: string;
  curricularYearId: number;
  curricularYear: string;
  semesterId: number;
  semester: string;
  curricularGradeId: number;
  curricularUnitId: number;
  curricularUnit: string;
  teacher: string;
};

export type FetchAgendaLaunchesParams = {
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  courseId?: number;
  curricularYearId?: number;
  curricularGradeId?: number;
  assessmentTypeId?: number;
  statusId?: number;
  page: number;
  limit: number;
};

export type FetchAgendaLaunchesResponse = {
  data: PostGraduationAgendaLaunch[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchAgendaLaunches(
  params: FetchAgendaLaunchesParams,
): Promise<FetchAgendaLaunchesResponse> {
  const { data } = await axiosNestGa.get<FetchAgendaLaunchesResponse>(
    "/post-graduation/assessments/agenda-launch",
    { params },
  );

  return data;
}
