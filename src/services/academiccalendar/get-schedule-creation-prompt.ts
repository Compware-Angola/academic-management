import { axiosNestGa } from "@/lib/axios-nest-ga";
export type ScheduleCreationPrompt = {
  data_inicio: string;
  data_fim: string;
  pk_prazo: number;
  observacao: string;
  fk_tipo_prazo: number;
  tipo_prazo_nome: string;
  tipo_prazo_sigla: string;
};

export async function getScheduleCreationPrompt(
  anoLectivo: number,
): Promise<ScheduleCreationPrompt | null> {
  const response = await axiosNestGa.get<ScheduleCreationPrompt>(
    "/academic-activities/prompt-to-create-and-edit/schedule",
    {
      params: { anoLectivo },
    },
  );

  return response.data ?? null;
}
