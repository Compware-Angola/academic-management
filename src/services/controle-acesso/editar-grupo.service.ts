// src/services/group/editar-grupo.service.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type EditarGrupoPayload = {
  id: string | number;
  designacao: string;
  descricao?: string | null;
  sigla: string;
  fkTipoDeGrupo: number;
  obs?: string;
  ordem?: number;
  modulos?: string;
  active_state: number;
};

export type EditarGrupoResponse = {
  message: string;
};

export async function editarGrupoService({
  id,
  ...payload
}: EditarGrupoPayload): Promise<EditarGrupoResponse> {
  const { data } = await axiosNestGa.put<EditarGrupoResponse>(
    `/groups/${id}`,
    payload
  );

  return data;
}
