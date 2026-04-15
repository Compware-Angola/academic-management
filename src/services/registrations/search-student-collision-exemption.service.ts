import { axiosNestGa } from "@/lib/axios-nest-ga";

export type SearchStudentCollisionExemptionItem = {
  matricula: number;
  nome: string;
  email: string;
  telefone: string;
  curso: string;
  codigo_turno: number;
};

export type SearchStudentCollisionExemptionResponse = {
  data: SearchStudentCollisionExemptionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type SearchStudentCollisionExemptionParams = {
  page?: number;
  limit?: number;
  anoLectivo?: number;
  curso?: number;
  turno?: number;
  search?: string;
};

export async function searchStudentsCollisionExemptionService({
  page = 1,
  limit = 10,
  anoLectivo = 0,
  curso = 0,
  turno = 0,
  search = "",
}: SearchStudentCollisionExemptionParams): Promise<SearchStudentCollisionExemptionResponse> {
  const { data } =
    await axiosNestGa.get<SearchStudentCollisionExemptionResponse>(
      "/registration/pesquisar-estudantes-isencao",
      {
        params: {
          page,
          limit,
          anoLectivo,
          curso,
          turno,
          search,
        },
      }
    );

  return data;
}