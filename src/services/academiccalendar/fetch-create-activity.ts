

import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface CriarAtividadePayload {
  designacao: string;
  codigo_ano_lectivo: number;
  codigo_tipo_candidatura: number;
  codigo_tipo_calendario: number;
  codigo_utilizador: number;
  data_inicio: string; // formato YYYY-MM-DD
  data_fim: string;    // formato YYYY-MM-DD
}

/**
 * Busca o calendário de mensalidades/propinas por ano letivo
 * @param CriarAtividadePayload - ex: 23, 24, 25...
 */
export async function fetchCreateActivity(payload: CriarAtividadePayload): Promise<any> {
  const { data } = await axiosApexGa.post("/ga/academic-calendar/academic-activities", payload);
  return data; 
}