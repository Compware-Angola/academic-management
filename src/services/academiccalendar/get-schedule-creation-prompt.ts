import { axiosNestGa } from "@/lib/axios-nest-ga";
export type ScheduleCreationPrompt = {
  data_inicio: string;
  data_fim: string;
  pk_prazo: number;
  observacao: string;
  fk_tipo_prazo: number;
  tipo_prazo_nome: string;
  tipo_prazo_sigla: string;
  is_in_prazo: boolean;
};

export async function getScheduleCreationPrompt(
  anoLectivo: number,
  semestre?: number,
): Promise<ScheduleCreationPrompt | null> {
  const response = await axiosNestGa.get<ScheduleCreationPrompt>(
    "/academic-activities/prompt-to-create-and-edit/schedule",
    {
      params: { anoLectivo, semestre },
    },
  );

  return response.data ?? null;
}
type CurrentAcademicCalender = {
  anoId: number;
  semestre: number | null;
  descricao: string;
  dataFim: Date | null;
};
export async function getCurentSemester(): Promise<CurrentAcademicCalender | null> {
  const response = await axiosNestGa.get<CurrentAcademicCalender>(
    "/academic-activities/current-semester",
  );

  return response.data ?? null;
}
