import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationVacancyOption = {
  id: number;
  designation: string;
};

export type PostGraduationVacancyOptions = {
  courses: PostGraduationVacancyOption[];
  periods: PostGraduationVacancyOption[];
};

export type PostGraduationVacancy = {
  id: number;
  courseId: number;
  course: string;
  periodId: number;
  period: string;
  academicYearId: number;
  academicYear: string;
  totalVacancies: number;
  occupiedVacancies: number;
  vacancyBalance: number;
  availableVacancies: number;
  excessConfirmations: number;
  createdAt: string;
  updatedAt: string;
};

export type FetchPostGraduationVacanciesParams = {
  academicYearId: number;
  degreeId: number;
  courseId?: number;
  periodId?: number;
  page: number;
  limit: number;
};

export type FetchPostGraduationVacanciesResponse = {
  data: PostGraduationVacancy[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreatePostGraduationVacancyPayload = {
  academicYearId: number;
  degreeId: number;
  courseId: number;
  periodId: number;
  numberOfVacancies: number;
};

export type UpdatePostGraduationVacancyPayload = {
  numberOfVacancies: number;
};

type VacancyMutationResponse = {
  message: string;
  data: {
    id: number;
  };
};

export async function fetchPostGraduationVacancyOptions(
  degreeId: number,
): Promise<PostGraduationVacancyOptions> {
  const { data } = await axiosNestGa.get<PostGraduationVacancyOptions>(
    "/post-graduation/vacancies/options",
    { params: { degreeId } },
  );

  return data;
}

export async function fetchPostGraduationVacancies(
  params: FetchPostGraduationVacanciesParams,
): Promise<FetchPostGraduationVacanciesResponse> {
  const { data } =
    await axiosNestGa.get<FetchPostGraduationVacanciesResponse>(
      "/post-graduation/vacancies",
      { params },
    );

  return data;
}

export async function createPostGraduationVacancy(
  payload: CreatePostGraduationVacancyPayload,
): Promise<VacancyMutationResponse> {
  const { data } = await axiosNestGa.post<VacancyMutationResponse>(
    "/post-graduation/vacancies",
    payload,
  );

  return data;
}

export async function updatePostGraduationVacancy(
  vacancyId: number,
  payload: UpdatePostGraduationVacancyPayload,
): Promise<VacancyMutationResponse> {
  const { data } = await axiosNestGa.patch<VacancyMutationResponse>(
    `/post-graduation/vacancies/${vacancyId}`,
    payload,
  );

  return data;
}
