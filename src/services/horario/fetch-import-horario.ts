import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface ImportSchedulesParams {
  fkanoLectivoOrigem: number;
  fkanoLectivoDestino: number;
  fkCurso: number;
  fkClasse: number;
  fksemestre: number;
  fkperiodo: number;
}

export interface HorarioTempo {
  horaInicio: string;
  horaTermino: string;
}

export interface DiaAula {
  tempos: HorarioTempo[];
}

export interface Aulas {
  segunda: DiaAula;
  terca: DiaAula;
  quarta: DiaAula;
  quinta: DiaAula;
  sexta: DiaAula;
  sabado: DiaAula;
  domingo: DiaAula;
}

export interface HorarioImportacao {
  horarioId: number;
  designacao: string;
  aulas: Aulas;
}

export interface ImportScheduleItem {
  gradeCurricularId: number;
  disciplina: string;
  disciplinaId: number;
  encontrado: boolean;
  horarios: HorarioImportacao[];
}

export const importSchedules = async (
  params: ImportSchedulesParams,
): Promise<ImportScheduleItem[]> => {
  const { data } = await axiosNestGa.get("/import-schedules", {
    params,
  });

  return data;
};
