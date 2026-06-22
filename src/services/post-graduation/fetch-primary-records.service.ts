import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationPrimaryRecord = {
  number: number;
  enrollmentId: number;
  fullName: string;
  identityDocument: string | null;
  gender: string | null;
  age: number | null;
  birthDate: string | null;
  residenceProvince: string | null;
  residenceMunicipality: string | null;
  countryOfOrigin: string | null;
  studyPeriod: string | null;
  faculty: string;
  course: string;
  applicationTypeId: number;
  applicationType: string;
  curricularYear: number | null;
  enrollmentStatus: string;
};

export type FetchPrimaryRecordsResponse = {
  data: PostGraduationPrimaryRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchPrimaryRecordsParams = {
  academicYearId: number;
  applicationTypeId?: number;
  search?: string;
  page?: number;
  limit?: number;
};

export async function fetchPrimaryRecords(
  params: FetchPrimaryRecordsParams
): Promise<FetchPrimaryRecordsResponse> {
  const { data } = await axiosNestGa.get<FetchPrimaryRecordsResponse>(
    "/post-graduation/primary-records",
    {
      params: {
        academicYearId: params.academicYearId,
        applicationTypeId: params.applicationTypeId,
        search: params.search?.trim() || undefined,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    }
  );

  return data;
}
