import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DiaSemana = {
  pkDiaDaSemana: number;
  designacao: string;
  ordem: number;
};

export type TempoOcupado = {
  horaInicio: string;
  horaFim: string;
  disponivel: boolean;
  codigoAula: number;
  tipoAula: string | null;
  periodo: string;
  ordem_tempo: number;
};

export type AulasOcupadasPorDia = {
  diaSemana: DiaSemana;
  tempos: TempoOcupado[];
};

export type FetchAulasOcupadasResponse = {
  aulas: AulasOcupadasPorDia[];
};

type FetchAulasOcupadasParams = {
  salaId: number;
  anoLectivo: number;
  periodo: number;
  semestre:number;
  horarioId?:number
};

export async function fetchAulasOcupadas({
  salaId,
  anoLectivo,
  periodo,
  semestre,
  horarioId
}: FetchAulasOcupadasParams): Promise<AulasOcupadasPorDia[]> {
  const { data } = await axiosNestGa.get<FetchAulasOcupadasResponse>(
    `/schedule/aulas-ocupadas/${salaId}`,
    {
      params: { anoLectivo, periodo,semestre,horarioId },
    },
  );

  return data.aulas ?? [];
}
