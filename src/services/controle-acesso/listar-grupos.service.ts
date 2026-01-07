import { axiosNestGa } from "@/lib/axios-nest-ga";
import { normalizeParam } from "@/util/normalize-param";

export type ListarGruposPayload = {
  typeGroup?: number | string;
  page?: number;
  limit?: number;
  search?: string;
};

export type Grupo = {
  codigo: number;
  designacao: string;
  descricao: string | null;
  sigla: string;
  type_group: number;
  active_state: number;
  created_at: string;
  updated_at: string;
  user_count: number;
};

export type ListarGruposResponse = {
  data: Grupo[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

export async function listarGruposService(
  payload: ListarGruposPayload
): Promise<ListarGruposResponse> {
  const { typeGroup = 1, page = 1, limit = 25, search } = payload;

  const params = {
    type_group: normalizeParam(typeGroup),
    page,
    limit,
    search: normalizeParam(search),
  };

  const { data } = await axiosNestGa.get<ListarGruposResponse>(
    "/groups/find-all",
    {
      params,
    }
  );

  return data;
}
