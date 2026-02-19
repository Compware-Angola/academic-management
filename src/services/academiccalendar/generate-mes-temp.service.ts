// src/services/academiccalendar/generate-mes-temp.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";
import { normalizeParam } from "@/util/normalize-param";

export type MesTemp = {
  designacao: string;
  isencao: number;
  ordem_mes: number;
  ano_lectivo: number;
  prestacao: number;
  activo: number;
  activo_posgraduacao: number;
  data_limite: string;
  data_inicial: string;
  data_final: string;
  data_final_desconto: string | null;
  semestre: number;
  semestre_posgraduacao: number;
};

/* ---------- PAYLOAD ---------- */

export type GenerateMesTempPayload = {
  anoLectivoId: number | string;
};

/* ---------- RESPONSE COMPLETO ---------- */

export type GenerateMesTempResponse = MesTemp[];

/* ---------- SERVICE ---------- */
export async function generateMesTempService(
  payload: GenerateMesTempPayload
): Promise<GenerateMesTempResponse> {

  const { anoLectivoId } = payload;

  const params = {
    anoLectivoId: normalizeParam(anoLectivoId),
  };

  const { data } = await axiosNestGa.get<GenerateMesTempResponse>(
    "/academic-calendar/generate-mes-temp",
    { params }
  );

  return data;
}
