// src/services/userGroupService.ts
import { axiosApexGa } from "@/lib/axios-apex-ga";
// src/types/user-group.types.ts
export type UserGroup = {
  codigo: number;
  descricao: string;
  tipo_grupo:number;
};

export type UserGroupsResponse = {
  grupos: UserGroup[];
};
export async function fetchUserGroups(userId: number): Promise<UserGroup[]> {
  try {
    const { data } = await axiosApexGa.get<UserGroupsResponse>(
      `/uma/utilizadores/${userId}/grupos`
    );

    return data.grupos ?? [];
  } catch (error) {
    console.error(`Erro ao carregar grupos do utilizador ${userId}:`, error);
    return [];
  }
}