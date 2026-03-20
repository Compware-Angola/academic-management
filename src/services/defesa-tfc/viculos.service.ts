import { axiosNestGa } from "@/lib/axios-nest-ga";

export type VinculosPayload = {
  anoLectivoId: number;
  orientadorId?: number;
  cursoId?: number;
  search?: string;
  page?: number;
  limit?: number;
};

export type VinculoItem = {
  nome_aluno: string;
  matricula: number;
  curso: string;
  tema: string;
  nome_orientador: string;
  data_cadastro: string;
};

export type VinculosResponse = {
  data: VinculoItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getVinculosService(
  payload: VinculosPayload,
): Promise<VinculosResponse> {
  const { data } = await axiosNestGa.get<VinculosResponse>(
    `defense-management-tfc/vinculos`,
    {
      params: payload,
    },
  );
  return data;
}