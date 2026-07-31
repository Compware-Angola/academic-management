import { axiosNestGa } from "@/lib/axios-nest-ga";

// ─────────────────────────────────────────────────────────────
// Tipos do resultado da importação
// ─────────────────────────────────────────────────────────────

export type ImportResultStatus =
  | "inserido"
  | "colisao_total"
  | "colisao_parcial"
  | "erro";

export interface ImportResultDetail {
  scheduleId: number;
  horarioOrigemId: number;
  horarioDestinoId: number | null;
  designacaoOrigem: string;
  designacaoDestino: string | null;
  status: ImportResultStatus;
  diasInseridos: number[];
  diasColididos: number[];
  mensagem?: string;
}

export interface ImportResultResponse {
  totalProcessados: number;
  totalInseridos: number;
  totalColisaoParcial: number;
  totalColisaoTotal: number;
  totalErros: number;
  detalhes: ImportResultDetail[];
}

export interface ScheduleImportedItem {
  scheduleId: number;
}

export interface ImportSchedulesPayload {
  schedulesImported: ScheduleImportedItem[];
  permitiColisao: boolean;
  fkanoLectivoDestino: number;
}

export const createImportSchedules = async (
  payload: ImportSchedulesPayload,
): Promise<ImportResultResponse> => {
  const { data } = await axiosNestGa.post("/import-schedules", payload);

  return data;
};
