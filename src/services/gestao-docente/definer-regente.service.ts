import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DefinirRegentePayload = {
  anoLectivo: number;
  gradeCurricular: number;
  docente: number;
  semestre: number;
  createdBy: number;
};

export type DefinirRegenteResponse = {
  message: string;
};

export async function DefinirRegenteService(
  payload: DefinirRegentePayload
): Promise<DefinirRegenteResponse> {
  const { data } = await axiosNestGa.post<DefinirRegenteResponse>(
    "/docente-gestao/regentes/definir",
    payload
  );

  return data;
}