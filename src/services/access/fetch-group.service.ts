// src/services/groupService.ts
import { axiosApexGa } from "@/lib/axios-apex-ga";
// src/types/group.types.ts
export type Group = {
  codigo: number;
  descricao: string;
};

export type GroupsResponse = {
  grupo: Group[];
};
export async function fetchAllGroupsDropDown(): Promise<Group[]> {
  try {
    const { data } = await axiosApexGa.get<GroupsResponse>(
      "/uma/listargrup_filtro_paraacesso"
    );

    // O backend retorna { "grupo": [...] }
    return data.grupo ?? [];
  } catch (error) {
    console.error("Erro ao carregar lista de grupos:", error);
    return [];
  }
}