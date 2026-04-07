
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AtualizarDocenteSubstitutoPayload = {
  id: number;
  fkDocenteOriginal: number;
  fkDocenteSubstituto: number;
  fkHorario: number;
  dataInicio: string;
  dataTermino?: string;
  obs?: string;
};

export type AtualizarDocenteSubstitutoResponse = {
  success: boolean;
  message: string;
  id: number;
};

export async function atualizarDocenteSubstitutoService(
  payload: AtualizarDocenteSubstitutoPayload
): Promise<AtualizarDocenteSubstitutoResponse> {
  const { id, ...body } = payload;

  const { data } = await axiosNestGa.put<AtualizarDocenteSubstitutoResponse>(
    `/docente-substituto/${id}`,
    body
  );

  return data;
}