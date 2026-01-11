// src/services/accessService.ts
import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestGa } from "@/lib/axios-nest-ga";
// src/types/access.types.ts
export type Access = {
  codigo: number;
  descricao: string;
  disponibilidade: number; // 1 = ativo, 0 = inativo
  "Update at": string;
};

export type AccessResponse = {
  acesso: Access[];
};

/**
 * Busca os acessos (permissões) de um determinado grupo
 * @param groupId - código do grupo (ex: 24)
 */
export async function fetchGroupAccesses(groupId: number): Promise<Access[]> {
  try {
    const { data } = await axiosApexGa.get<AccessResponse>(
      `/uma/utilizadorgrupo/${groupId}/acessos`
    );

    return data.acesso ?? [];
  } catch (error) {
    console.error(`Erro ao carregar acessos do grupo ${groupId}:`, error);
    return [];
  }
}

export async function deleteGroupAccess({
  grupoId,
  utilizadorId,
}: {
  utilizadorId: number;
  grupoId: number;
}): Promise<void> {
  await axiosNestGa.delete(
    `acess_management/grupo/${utilizadorId}/acesso/${grupoId}`
  );
}
