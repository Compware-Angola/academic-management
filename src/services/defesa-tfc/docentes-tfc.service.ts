import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DocenteTFC = {
  codigo: number;
  nome: string;
}

export type ListDocentesResponse = {
  data: DocenteTFC[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type DocentesTfcPayload = {
  faculdadeId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getDocentesTfcService(
  payload: DocentesTfcPayload,
): Promise<ListDocentesResponse> {
  const { data } = await axiosNestGa.get<ListDocentesResponse>(
    `defense-management-tfc/docentes`,
    {
      params: payload,
    },
  );
  return data;
}
