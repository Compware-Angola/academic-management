import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GuidanceResearchManagementStudentParams = {
  search?: string;
  anoLectivo?: number;
  curso?: number;
  tipoCandidatura?: number;
  page?: number;
  limit?: number;
};

export type GuidanceResearchManagementStudentItem = {
  nome: string;
  bilhete: string;
  matricula: number;
  genero: string;
  curso: string;
  candidatura: string;
};

export type GuidanceResearchManagementStudentResponse = {
  data: GuidanceResearchManagementStudentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getGuidanceResearchManagementStudentService(
  payload: GuidanceResearchManagementStudentParams,
): Promise<GuidanceResearchManagementStudentResponse> {
  const {
    anoLectivo,
    curso,
    tipoCandidatura,
    page = 1,
    limit = 10,
    search
  } = payload;

  const { data } = await axiosNestGa.get<GuidanceResearchManagementStudentResponse>(
    "post-graduation/guidance-research-management/students",
    {
      params: {
        search,
        anoLectivo,
        curso,
        tipoCandidatura,
        page,
        limit,
      },
    },
  );

  return data;
}
