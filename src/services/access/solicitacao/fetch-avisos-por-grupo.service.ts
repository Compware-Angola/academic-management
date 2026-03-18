import { axiosNestGa } from "@/lib/axios-nest-ga";
import { normalizeParam } from "@/util/normalize-param";

/* ---------- RESPONSE ITEM ---------- */
export type AvisoPorGrupo = {
  CODIGO: number;
  ASSUNTO: string;
  DESCRICAO: string;
  FILE_NAME?: string | null;
  DATE_EXPIRACAO: string | null;
  DESTINO: number;
  CURSO: number | null;
  PERIODO: number | null;
  AUTOR: string | null;
  CURSO_NOME: string | null;
  DESTINO_NOME: string | null;
};

/* ---------- RESPONSE COMPLETO ---------- */
export type AvisosPorGrupoResponse = AvisoPorGrupo[];

/* ---------- SERVICE ---------- */
export async function AvisosPorGrupoService({
  grupoId,
  curso,
  periodo,
}: {
  grupoId: number;
  curso?: number;
  periodo?: number;
}): Promise<AvisosPorGrupoResponse> {
  const { data } = await axiosNestGa.get<AvisosPorGrupoResponse>(
    "/solicitacoa/avisos-por-grupo",
    {
      params: {
        grupoId,
        curso: normalizeParam(curso),
        periodo: normalizeParam(periodo),
      },
    }
  );

  return data;
}