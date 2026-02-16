export type ExamCreationPrompt = {
  data_inicio: string;
  data_fim: string;
  pk_prazo: number;
  observacao: string;
  fk_tipo_prazo: number;
  tipo_prazo_nome: string;
  tipo_prazo_sigla: string;
  tipo_avaliacao_nome: string;
};
import { axiosNestGa } from "@/lib/axios-nest-ga";

type Params = {
  anoLectivo: number;
  semestre?: number;
  typeAvaliation?: number;
};

export async function getExamCreationPrompt(
  params: Params,
): Promise<ExamCreationPrompt | null> {
  const response = await axiosNestGa.get<ExamCreationPrompt>(
    "/academic-activities/prompt-to-create-and-edit/exam",
    { params },
  );

  return response.data ?? null;
}
