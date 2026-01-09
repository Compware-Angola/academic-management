import { axiosNestGa } from "@/lib/axios-nest-ga";
import { normalizeParam } from "@/util/normalize-param";

export type ListarCargosPayload = {
  tipoCargoId?: number;
  utilizadorId?: string;
};

export type Cargo = {
  pkCargo: number;
  fkTipoCargo: number;
  tipoCargoDescricao: string;
  fkUtilizador: number;
  utilizadorNome: string;
  fkFaculdade: number | null;
  faculdadeNome: string | null;
  fkCurso: number | null;
  cursoNome: string | null;
  active: boolean;
  createdAt: string;
  createdBy: string;
};

export async function listarCargosAdministrativoService(
  payload: ListarCargosPayload
): Promise<Cargo[]> {
  const { tipoCargoId, utilizadorId } = payload;

  const params = {
    tipoCargoId: normalizeParam(tipoCargoId),
    utilizadorId: normalizeParam(utilizadorId),
  };

  const { data } = await axiosNestGa.get<Cargo[]>("/cargos-administrativos", {
    params,
  });

  return data;
}
