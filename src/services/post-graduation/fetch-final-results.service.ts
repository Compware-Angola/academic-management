import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationFinalResultStatus =
  | "ADMITTED"
  | "FAILED"
  | "PENDING";

export type PostGraduationFinalResult = {
  candidateId: number;
  candidateName: string;
  identityDocument: string | null;
  degreeId: number;
  degree: string;
  courseId: number;
  course: string;
  facultyId: number;
  faculty: string;
  examScheduleId: number;
  periodId: number | null;
  period: string | null;
  roomId: number | null;
  room: string | null;
  examDate: string | null;
  examScore: number | null;
  proofStatus: number | null;
  admissionId: number | null;
  admissionAverage: number | null;
  admissionResult: string | null;
  admissionDate: string | null;
  resultStatus: PostGraduationFinalResultStatus;
};

export type FetchPostGraduationFinalResultsParams = {
  academicYearId: number;
  degreeId: number;
  courseId?: number;
  facultyId?: number;
  periodId?: number;
  roomId?: number;
  candidateId?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

export type FetchPostGraduationFinalResultsResponse = {
  data: PostGraduationFinalResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchPostGraduationFinalResults(
  params: FetchPostGraduationFinalResultsParams,
): Promise<FetchPostGraduationFinalResultsResponse> {
  const { data } =
    await axiosNestGa.get<FetchPostGraduationFinalResultsResponse>(
      "/post-graduation/access-exam/final-results",
      { params },
    );

  return data;
}
