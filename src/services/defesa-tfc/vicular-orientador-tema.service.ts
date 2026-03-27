import { axiosNestGa } from "@/lib/axios-nest-ga";
export type VincularOrientadorTemaDto = {
  codigoMatricula: number;
  codigoOrientador: number;
  tema: string;
  anoLectivoId: number;
}

export type VinculoResponse = {
  message: string;
}

export async function vincularOrientadorTemaService(
  payload: VincularOrientadorTemaDto,
): Promise<VinculoResponse> {
  const { data } = await axiosNestGa.post<VinculoResponse>(
    `defense-management-tfc/vinculos`,
    payload,
  );
  return data;
}