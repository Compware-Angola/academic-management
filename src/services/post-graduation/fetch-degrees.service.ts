import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PostGraduationDegree = {
  id: number | null;
  designation: string;
};

export type FetchPostGraduationDegreesResponse = {
  data: PostGraduationDegree[];
};

export async function fetchPostGraduationDegrees(): Promise<FetchPostGraduationDegreesResponse> {
  const { data } =
    await axiosNestGa.get<FetchPostGraduationDegreesResponse>(
      "/post-graduation/degrees"
    );

  return data;
}
