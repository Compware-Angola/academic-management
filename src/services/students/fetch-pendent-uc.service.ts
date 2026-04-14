import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListPendentUCPayload = {
  codigoMatricula: number;
  page?: number;
  limit?: number;
};

export type PendentUCItem = {
  codigo_disciplina: string;
  codigo_grade: number;
  disciplina: string;
  classe: string;
  semestre: string;
  duracao: string;
  tipo: string;
};

export type ListPendentUCResponse = {
  data: PendentUCItem[];
  page: number;
  limit: number;
  hasNextPage: boolean;
};

export async function getListPendentUCService(
  payload: ListPendentUCPayload,
): Promise<ListPendentUCResponse> {
  const { codigoMatricula, page = 1, limit = 25 } = payload;

  const { data } = await axiosNestGa.get<ListPendentUCResponse>(
    "/students/enrollment/pendent-uc",
    {
      params: {
        codigoMatricula,
        page,
        limit,
      },
    },
  );

  return data;
}
