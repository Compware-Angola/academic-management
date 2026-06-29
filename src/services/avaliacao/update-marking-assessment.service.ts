import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface UpdateMarkingAssessmentPayload {
  codigoCalendario: number;

  codigoTipoProva?: number;
  codigoModalidade?: number;
  codigoSala?: number;
  codigoUtilizador?: number;
  codigoPeriodo?: number;
  codigoDisciplina?: number;

  dataProva?: string;
  duracaoProva?: number;
  horaTermino?: string;
  horaProva?: string;

  url?: string;
  Horario?: number;
  prazoId?: number;

  vigilantes?: {
    codigoUtilizador: number;
    desc: string;
  }[];
}

export async function updateMarkingAssessmentService(
  payload: UpdateMarkingAssessmentPayload,
): Promise<void> {
  await axiosNestGa.put(`/assessment/update-calendario-prova`, payload);
}
