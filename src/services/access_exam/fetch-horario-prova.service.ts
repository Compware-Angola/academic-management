
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type HorarioProvaParams = {
  codigoAnoLetivo?: number| string;
  codigoCurso?: number;
  codigoTurno?: number;
  page?: number;
  limit?: number;
};

export type HorarioProva = {
  codigo_ano_lectivo: number;
  ano_lectivo: string;
  codigo_curso: number;
  curso: string;
  codigo_periodo: number;
  periodo: string;
  codigo_sala: number;
  sala: string;
  capacidade_sala: number;
  data_realizacao: string;
  hora_inicio: string;
  hora_fim: string;
  quantidade_alunos: number;
};

export type HorarioProvaResponse = {
  data: HorarioProva[];
  total: number;
  page: number;
  limit: number;
  totalpages: number;
};

export async function fetchHorarioProva(
  params: HorarioProvaParams
): Promise<HorarioProvaResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/candidatos/prova/horario",
    { params }
  );
  return data;
}