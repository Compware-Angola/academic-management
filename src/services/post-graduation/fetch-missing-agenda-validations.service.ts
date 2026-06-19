import { axiosNestGa } from "@/lib/axios-nest-ga";

export type MissingPostGraduationAgendaValidation = {
  curricularGradeId: number;
  curricularUnitId: number;
  curricularUnit: string;
  courseId: number;
  course: string;
  curricularYearId: number;
  curricularYear: string;
  semesterId: number;
  semester: string;
  teacher: string | null;
};

export type FetchMissingAgendaValidationsParams = {
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  courseId?: number;
  curricularYearId?: number;
  curricularGradeId?: number;
  page: number;
  limit: number;
};

export type FetchMissingAgendaValidationsResponse = {
  data: MissingPostGraduationAgendaValidation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchMissingAgendaValidations(
  params: FetchMissingAgendaValidationsParams,
): Promise<FetchMissingAgendaValidationsResponse> {
  const { data } =
    await axiosNestGa.get<FetchMissingAgendaValidationsResponse>(
      "/post-graduation/assessments/agenda-validation/missing",
      { params },
    );

  return data;
}
