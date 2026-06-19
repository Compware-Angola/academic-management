import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AgendaValidationOption = {
  id: number;
  designation: string;
};

export type PostGraduationAgendaValidationOptions = {
  courses: AgendaValidationOption[];
  curricularYears: Array<
    AgendaValidationOption & {
      courseId: number;
    }
  >;
  curricularUnits: Array<{
    curricularGradeId: number;
    curricularUnitId: number;
    designation: string;
    courseId: number;
    curricularYearId: number;
  }>;
  assessmentTypes: AgendaValidationOption[];
  statuses: AgendaValidationOption[];
};

export type FetchAgendaValidationOptionsParams = {
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  courseId?: number;
};

export type FetchAgendaValidationOptionsResponse = {
  data: PostGraduationAgendaValidationOptions;
};

export async function fetchAgendaValidationOptions(
  params: FetchAgendaValidationOptionsParams,
): Promise<FetchAgendaValidationOptionsResponse> {
  const { data } =
    await axiosNestGa.get<FetchAgendaValidationOptionsResponse>(
      "/post-graduation/assessments/agenda-validation/options",
      { params },
    );

  return data;
}
