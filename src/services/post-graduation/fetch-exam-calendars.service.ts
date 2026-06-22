import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationExamCalendar = {
  id: number;
  academicYearId: number;
  academicYear: string;
  degreeId: number;
  degree: string;
  semesterId: number | null;
  semester: string | null;
  assessmentPeriodId: number | null;
  assessmentPeriod: string | null;
  startDate: string | null;
  endDate: string | null;
  observation: string | null;
  createdById: number | null;
  createdBy: string | null;
};

export type FetchExamCalendarsParams = {
  academicYearId: number;
  degreeId: number;
};

export type FetchExamCalendarsResponse = {
  data: PostGraduationExamCalendar[];
};

export async function fetchExamCalendars(
  params: FetchExamCalendarsParams,
): Promise<FetchExamCalendarsResponse> {
  const { data } = await axiosNestGa.get<FetchExamCalendarsResponse>(
    "/post-graduation/exam-calendars",
    {
      params,
    },
  );

  return data;
}
