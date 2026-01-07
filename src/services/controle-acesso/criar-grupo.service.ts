// src/services/group/criar-grupo.service.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CriarGrupoPayload = {
  designacao: string;
  descricao?: string | null;
  sigla: string;
  fkTipoDeGrupo: number; // 1 = Multiutilizador | 2 = Unitário
  obs?: string;
  ordem?: number;
  modulos?: string;
  active_state: number; // sempre 1 ao criar
};

export type CriarGrupoResponse = {
  message: string;
};

export async function criarGrupoService(
  payload: CriarGrupoPayload
): Promise<CriarGrupoResponse> {
  const { data } = await axiosNestGa.post<CriarGrupoResponse>(
    "/groups",
    payload
  );

  return data;
}
