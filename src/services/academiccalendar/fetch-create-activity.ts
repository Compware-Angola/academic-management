import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface CriarAtividadePayload {
  designacao: string;
  codigo_ano_lectivo: number;
  codigo_tipo_candidatura: number;
  codigo_tipo_calendario: number;
  codigo_utilizador?: number;
  data_inicio: string; // formato YYYY-MM-DD
  data_fim: string; // formato YYYY-MM-DD
}

/**
 * Busca o calendário de mensalidades/propinas por ano letivo
 * @param CriarAtividadePayload - ex: 23, 24, 25...
 */
export async function fetchCreateActivity(
  payload: CriarAtividadePayload
): Promise<any> {
  const { data } = await axiosNestGa.post(
    "/academic-activities/calendar-activities",
    payload
  );
  return data;
}
export type updateActivity = {
  codigo: number;
  designacao: string;
  codigo_ano_lectivo: number;
  codigo_tipo_candidatura: number;
  codigo_tipo_calendario: number;
  data_inicio: string;
  data_fim: string;
};

export async function updateActivity(params: updateActivity) {
  const { codigo, ...payload } = params;
  const { data } = await axiosNestGa.put(
    `/academic-activities/calendar-activities/${codigo}`,
    payload
  );
  return data;
}
