import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type Tempo = {
  ordem: number;
  horaInicio: string;
  horaFim: string;
  disponivel: boolean;
};

export type DiaSemana = {
  pkDiaDaSemana: number;
  designacao: string;
  ordem: number;
};

export type TempoDisponivelItem = {
  diaSemana: DiaSemana;
  tempos: Tempo[];
};

export type TempoDisponivelResponse = {
  items: TempoDisponivelItem[];
};
export async function fetchTemposDisponiveis(
  anoLectivo: number,
  periodo: number
): Promise<TempoDisponivelItem[]> {
  const { data } = await axiosNestGa.get<TempoDisponivelResponse>(
    `/class-times-schedule`,
    {
      params: {
      anoLectivo,
      periodo: periodo,
      },
    }
  );

  return data.items ?? [];
}
