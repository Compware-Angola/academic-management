// src/services/academiccalendar/create-mes-temp.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- TYPES ---------- */

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

export type CreateMesTempPayload = {
  meses: MesTemp[];
};

/* Ajustar conforme resposta real da API */
export type CreateMesTempResponse = MesTemp[];

/* ---------- SERVICE ---------- */

export async function createMesTempService(
  payload: CreateMesTempPayload
): Promise<CreateMesTempResponse> {
  const { data } = await axiosNestGa.post<CreateMesTempResponse>(
    "/academic-calendar/create-mes-temp",
    payload
  );

  return data;
}
