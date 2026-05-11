import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetUsersByGroupPayload = {
  pkGrupo: number; // obrigatório
  page?: number;
  limit?: number;
  nome?: string;
  pkUser?: number;
};

export type UserByGroupItem = {
  nome: string;
  username: string;
  email: string | null;
  active_state: number;
  fotoname: string | null;
  codigo_utilizador: number;
  codigo_grupo: number;
};

export type GetUsersByGroupResponse = {
  data: UserByGroupItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getUsersByGroupService(
  payload: GetUsersByGroupPayload,
): Promise<GetUsersByGroupResponse> {
  const { pkGrupo, page = 1, limit = 10, nome, pkUser } = payload;

  const { data } = await axiosNestGa.get<GetUsersByGroupResponse>(
    "/grupos/users",
    {
      params: {
        pkGrupo,
        page,
        limit,
        nome,
        pkUser,
      },
    },
  );

  return data;
}
