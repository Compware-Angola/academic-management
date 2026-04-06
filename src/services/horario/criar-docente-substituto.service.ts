
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CriarDocenteSubstitutoPayload = {
  fkDocenteOriginal: number;
  fkDocenteSubstituto: number;
  fkHorario: number;
  dataInicio: string;
  dataTermino?: string;
  obs?: string;
};

export type CriarDocenteSubstitutoResponse = {
  success: boolean;
  message: string;
  id: number;
};

export async function criarDocenteSubstitutoService(
  payload: CriarDocenteSubstitutoPayload
): Promise<CriarDocenteSubstitutoResponse> {
  const { data } = await axiosNestGa.post<CriarDocenteSubstitutoResponse>(
    "/docente-substituto",
    payload
  );

  return data;
}