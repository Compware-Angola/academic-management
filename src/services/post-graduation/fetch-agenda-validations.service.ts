import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationAgendaValidation = {
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
  validatedById: number | null;
  validatedBy: string | null;
};

export type FetchAgendaValidationsParams = {
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

export type FetchAgendaValidationsResponse = {
  data: PostGraduationAgendaValidation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchAgendaValidations(
  params: FetchAgendaValidationsParams,
): Promise<FetchAgendaValidationsResponse> {
  const { data } = await axiosNestGa.get<FetchAgendaValidationsResponse>(
    "/post-graduation/assessments/agenda-validation",
    { params },
  );

  return data;
}
