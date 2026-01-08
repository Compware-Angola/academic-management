// src/services/assessment/create-assessment-permission.service.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type VigilantePayload = {
  codigoUtilizador: number;
  desc: string;
};

export type CreateCalendarPayload = {
  codigoCalendario: number;
  codigoTipoProva: number;
  codigoModalidade: number;
  codigoSala: number;

  codigoPeriodo: number;
  codigoDisciplina: number;

  dataProva: string; // YYYY-MM-DD
  duracaoProva: number; // em minutos
  horaProva: string; // HH:mm
  horaTermino: string; // HH:mm

  url: string;

  Horario: number;
  descHorario: string;

  tipoPrazo: number;
  tipoAvaliacao: number;
  anoLectivo: number;
  tipoCandidatura: number;
  semestre: number;

  vigilantes: VigilantePayload[];
};

export interface CreateCalendarResponse {
  success: boolean;
  message: string;
}

export async function createCalendar(
  {
    codigoUtilizador,
    descUtilizador,
  }: { codigoUtilizador: number; descUtilizador: string },
  payload: CreateCalendarPayload
): Promise<CreateCalendarResponse> {
  const { data } = await axiosNestGa.post<CreateCalendarResponse>(
    "/assessment/create-calendario-prova",
    {
      codigoUtilizador,
      descUtilizador,
      utilizador: codigoUtilizador,
      ...payload,
    }
  );

  return data;
}
