// src/services/horario/horario-ver-inscricao.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type HorarioVerInscricao = {
  designacao: string;
  pk_horario: number;
  codigo_disciplina: number;
  disciplina: string;
};

type FindHorarioVerInscricaoParams = {
  curso: string;
  gradeCurricular: string;
  anoLectivo: string;
};

export async function fetchHorarioVerInscricao(
  params: FindHorarioVerInscricaoParams,
): Promise<HorarioVerInscricao[]> {
  const { curso, gradeCurricular, anoLectivo } = params;

  const { data } = await axiosNestGa.get("dropdown-filters/horario-ver-inscricao", {
    params: {
      curso,
      gradeCurricular,
      anoLectivo,
    },
  });

  return data?.data ?? [];
}