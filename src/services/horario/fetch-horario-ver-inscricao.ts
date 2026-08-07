// src/services/horario/horario-ver-inscricao.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type HorarioVerInscricao = {
  designacao: string;
  pk_horario: number;
  codigo_disciplina: number;
  disciplina: string;
};

export type FindHorarioVerInscricaoParams = {
  curso: number;
  gradeCurricular: number;
  anoLectivo: number;
  periodo?: number;
};

export async function fetchHorarioVerInscricao(
  params: FindHorarioVerInscricaoParams,
): Promise<HorarioVerInscricao[]> {
  const { curso, gradeCurricular, anoLectivo, periodo } = params;

  const { data } = await axiosNestGa.get("dropdown-filters/horario-ver-inscricao", {
    params: {
      curso,
      gradeCurricular,
      anoLectivo,
      periodo,
    },
  });

  return data?.data ?? [];
}