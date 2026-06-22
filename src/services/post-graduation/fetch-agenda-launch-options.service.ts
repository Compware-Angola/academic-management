import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AgendaLaunchOption = {
  id: number;
  designation: string;
};

export type PostGraduationAgendaLaunchOptions = {
  courses: AgendaLaunchOption[];
  curricularYears: Array<AgendaLaunchOption & { courseId: number }>;
  curricularUnits: Array<{
    curricularGradeId: number;
    curricularUnitId: number;
    designation: string;
    courseId: number;
    curricularYearId: number;
  }>;
  terms: Array<{
    id: number;
    assessmentTypeId: number;
    assessmentType: string;
    startDate: string;
    endDate: string;
    isOpen: boolean;
  }>;
  statuses: AgendaLaunchOption[];
};

export type FetchAgendaLaunchOptionsParams = {
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  courseId?: number;
};

export type FetchAgendaLaunchOptionsResponse = {
  data: PostGraduationAgendaLaunchOptions;
};

export async function fetchAgendaLaunchOptions(
  params: FetchAgendaLaunchOptionsParams,
): Promise<FetchAgendaLaunchOptionsResponse> {
  const { data } =
    await axiosNestGa.get<FetchAgendaLaunchOptionsResponse>(
      "/post-graduation/assessments/agenda-launch/options",
      { params },
    );

  return data;
}
