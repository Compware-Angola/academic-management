import { axiosApexGa } from "@/lib/axios-apex-ga";

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
  const { data } = await axiosApexGa.get<TempoDisponivelResponse>(
    `/tempos/disponiveis`,
    {
      params: {
        ano_lectivo: anoLectivo,
        periodo: periodo,
      },
    }
  );

  return data.items ?? [];
}
