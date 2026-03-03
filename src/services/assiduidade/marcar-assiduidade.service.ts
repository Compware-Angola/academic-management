import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface MarcarAulaPayload {
  codigoAgendamento: number;
  novoEstado: number;
}

export interface MarcarAulaResponse {
  message: string;
  success?: boolean;
}

export async function marcarAulaAssiduidadeService(
  payload: MarcarAulaPayload,
): Promise<MarcarAulaResponse> {
  const { codigoAgendamento, novoEstado } = payload;

  const { data } = await axiosNestGa.patch<MarcarAulaResponse>(
    "assiduidade/marcar-aula",
    {},
    {
      params: {
        codigoAgendamento,
        novoEstado,
      },
    },
  );

  return data;
}
export async function marcarAulaAssiduidadeProvaService(
  payload: MarcarAulaPayload,
): Promise<MarcarAulaResponse> {
  const { codigoAgendamento, novoEstado } = payload;

  const { data } = await axiosNestGa.patch<MarcarAulaResponse>(
    "assiduidade/marcar-prova",
    {},
    {
      params: {
        codigoAgendamento,
        novoEstado,
      },
    },
  );

  return data;
}