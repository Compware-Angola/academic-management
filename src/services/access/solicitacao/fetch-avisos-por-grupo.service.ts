import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AvisoPorGrupos = {
  CODIGO: number;
  ASSUNTO: string;
  DESCRICAO: string;
  STATUS: number;
  FILE_NAME?: string | null;
  DATE_EXPIRACAO: string | null;
  DESTINO: number;
  CURSO: number | null;
  PERIODO: number | null;
  AUTOR: string | null;
  CURSO_NOME: string | null;
  DESTINO_NOME: string | null;
};

type Params = {
  grupoIds?: number[];
};

export type AvisosPorGruposResponse = AvisoPorGrupos[];

export async function AvisosPorGruposService(
  params: Params
): Promise<AvisosPorGruposResponse> {

  const grupoIdsValidos =
    params.grupoIds?.filter(
      (id) => id !== undefined && id !== null && id !== 0
    ) ?? [];

  if (grupoIdsValidos.length === 0) {
    return [];
  }

  const { data } = await axiosNestGa.post<AvisosPorGruposResponse>(
    "solicitacoa/avisos-por-grupos",

    {
      grupoIds: grupoIdsValidos,
    },

  );

  return data;
}